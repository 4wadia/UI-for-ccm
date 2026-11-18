import 'dart:async';
import 'package:flutter/material.dart';
import '../models/financial_models.dart';
import '../theme/onyx_theme.dart';
import '../utils/format_currency.dart';

class HomeScreen extends StatefulWidget {
  final List<CreditCardModel> cards;
  final List<TransactionModel> transactions;
  final ValueChanged<TransactionModel> onSelectTransaction;
  final bool isDarkMode;
  final VoidCallback onToggleDarkMode;

  const HomeScreen({
    super.key,
    required this.cards,
    required this.transactions,
    required this.onSelectTransaction,
    required this.isDarkMode,
    required this.onToggleDarkMode,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with SingleTickerProviderStateMixin {
  bool _balanceVisible = true;
  bool _showSearch = false;
  bool _notificationOpen = false;
  bool _showAllTransactions = false;
  bool _themeExpanded = false;
  String _searchQuery = '';

  final TextEditingController _searchController = TextEditingController();
  final FocusNode _searchFocusNode = FocusNode();
  Timer? _themeTimer;
  Timer? _focusTimer;
  late final AnimationController _rippleController;

  @override
  void initState() {
    super.initState();
    _rippleController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );
  }

  @override
  void dispose() {
    _themeTimer?.cancel();
    _focusTimer?.cancel();
    _searchController.dispose();
    _searchFocusNode.dispose();
    _rippleController.dispose();
    super.dispose();
  }

  void _openSearch() {
    setState(() {
      _showSearch = true;
      _notificationOpen = false;
    });
    _focusTimer?.cancel();
    _focusTimer = Timer(const Duration(milliseconds: 220), () {
      if (mounted) _searchFocusNode.requestFocus();
    });
  }

  void _closeSearch() {
    _searchFocusNode.unfocus();
    setState(() {
      _showSearch = false;
      _searchQuery = '';
      _searchController.clear();
    });
  }

  void _handleToggleTheme() {
    widget.onToggleDarkMode();
    _rippleController.forward(from: 0.0);
    setState(() => _themeExpanded = true);
    _themeTimer?.cancel();
    _themeTimer = Timer(const Duration(milliseconds: 1300), () {
      if (mounted) setState(() => _themeExpanded = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    final palette = OnyxPalette(widget.isDarkMode);

    final totalCombinedLimit =
        widget.cards.fold<double>(0, (sum, c) => sum + c.limit);
    final totalCombinedSpend =
        widget.cards.fold<double>(0, (sum, c) => sum + c.balance);
    final utilizationPercent = totalCombinedLimit > 0
        ? ((totalCombinedSpend / totalCombinedLimit) * 100).round().clamp(0, 100)
        : 0;

    final queryLower = _searchQuery.toLowerCase();
    final filteredTransactions = widget.transactions.where((tx) {
      if (queryLower.isEmpty) return true;
      return tx.title.toLowerCase().contains(queryLower) ||
          tx.category.toLowerCase().contains(queryLower) ||
          tx.merchant.toLowerCase().contains(queryLower) ||
          (tx.cardBank?.displayName.toLowerCase().contains(queryLower) ?? false);
    }).toList();

    final initialTransactions = filteredTransactions.take(4).toList();
    final extraTransactions = filteredTransactions.skip(4).toList();

    return GestureDetector(
      onTap: () {
        if (_notificationOpen) setState(() => _notificationOpen = false);
      },
      behavior: HitTestBehavior.translucent,
      child: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 10, 16, 84),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Top User Row with Inline Self-Expanding Search & Dark/Light Toggle
                LayoutBuilder(
                  builder: (context, constraints) {
                    return SizedBox(
                      height: 36,
                      child: Stack(
                        alignment: Alignment.centerRight,
                        children: [
                          // Left Avatar + Name (fades smoothly as Search expands)
                          Positioned(
                            left: 0,
                            child: AnimatedOpacity(
                              duration: const Duration(milliseconds: 280),
                              curve: const Cubic(0.22, 1.0, 0.36, 1.0),
                              opacity: _showSearch ? 0.0 : 1.0,
                              child: AnimatedSlide(
                                duration: const Duration(milliseconds: 280),
                                curve: const Cubic(0.22, 1.0, 0.36, 1.0),
                                offset: _showSearch
                                    ? const Offset(-0.08, 0)
                                    : Offset.zero,
                                child: IgnorePointer(
                                  ignoring: _showSearch,
                                  child: Row(
                                    children: [
                                      Container(
                                        width: 36,
                                        height: 36,
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          border: Border.all(
                                            color: palette.gold,
                                            width: 1,
                                          ),
                                        ),
                                        alignment: Alignment.center,
                                        child: Text(
                                          'AS',
                                          style: OnyxTypography.mono(
                                            fontSize: 11,
                                            color: palette.primaryText,
                                            letterSpacing: 0.8,
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Text(
                                        'Arjun Sharma',
                                        style: OnyxTypography.sans(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w500,
                                          color: palette.primaryText,
                                          letterSpacing: -0.2,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),

                          // Right Controls: Search Pill + Theme Toggle + Bell
                          Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              // Self-Expanding Search Pill
                              AnimatedContainer(
                                duration: const Duration(milliseconds: 300),
                                curve: const Cubic(0.22, 1.0, 0.36, 1.0),
                                width: _showSearch ? constraints.maxWidth : 36,
                                height: 36,
                                padding: EdgeInsets.symmetric(
                                  horizontal: _showSearch ? 12 : 0,
                                ),
                                decoration: BoxDecoration(
                                  color: _showSearch
                                      ? palette.cardSurface
                                      : Colors.transparent,
                                  borderRadius: BorderRadius.circular(999),
                                  border: _showSearch
                                      ? Border.all(color: palette.border)
                                      : null,
                                ),
                                child: Row(
                                  mainAxisAlignment: _showSearch
                                      ? MainAxisAlignment.start
                                      : MainAxisAlignment.center,
                                  children: [
                                    GestureDetector(
                                      behavior: HitTestBehavior.opaque,
                                      onTap: _showSearch
                                          ? () => _searchFocusNode.requestFocus()
                                          : _openSearch,
                                      child: SizedBox(
                                        width: _showSearch ? 20 : 36,
                                        height: 36,
                                        child: Icon(
                                          Icons.search,
                                          size: 16,
                                          color: _showSearch
                                              ? palette.gold
                                              : palette.primaryText
                                                  .withOpacity(0.6),
                                        ),
                                      ),
                                    ),
                                    if (_showSearch) ...[
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: TextField(
                                          controller: _searchController,
                                          focusNode: _searchFocusNode,
                                          onChanged: (v) =>
                                              setState(() => _searchQuery = v),
                                          style: OnyxTypography.sans(
                                            fontSize: 12,
                                            color: palette.primaryText,
                                          ),
                                          decoration: InputDecoration(
                                            isCollapsed: true,
                                            border: InputBorder.none,
                                            hintText: 'Search merchant, bank...',
                                            hintStyle: OnyxTypography.sans(
                                              fontSize: 12,
                                              color: palette.primaryText
                                                  .withOpacity(0.4),
                                            ),
                                          ),
                                        ),
                                      ),
                                      GestureDetector(
                                        onTap: _closeSearch,
                                        child: Container(
                                          width: 24,
                                          height: 24,
                                          decoration: BoxDecoration(
                                            shape: BoxShape.circle,
                                            color: palette.hoverFill,
                                          ),
                                          child: Icon(
                                            Icons.close,
                                            size: 14,
                                            color: palette.primaryText
                                                .withOpacity(0.65),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ],
                                ),
                              ),

                              if (!_showSearch) ...[
                                const SizedBox(width: 4),
                                // Self-Expanding Dark/Light Mode Toggle + Ripple
                                Stack(
                                  alignment: Alignment.center,
                                  clipBehavior: Clip.none,
                                  children: [
                                    AnimatedBuilder(
                                      animation: _rippleController,
                                      builder: (context, _) {
                                        if (_rippleController.value == 0 ||
                                            _rippleController.value == 1) {
                                          return const SizedBox.shrink();
                                        }
                                        final t = Curves.easeOutCubic
                                            .transform(_rippleController.value);
                                        return Transform.scale(
                                          scale: 0.75 + (1.15 * t),
                                          child: Opacity(
                                            opacity: (1.0 - t) * 0.65,
                                            child: Container(
                                              width: 36,
                                              height: 36,
                                              decoration: BoxDecoration(
                                                shape: BoxShape.circle,
                                                color: palette.gold
                                                    .withOpacity(0.15),
                                                border: Border.all(
                                                  color: palette.gold
                                                      .withOpacity(0.6),
                                                ),
                                              ),
                                            ),
                                          ),
                                        );
                                      },
                                    ),
                                    GestureDetector(
                                      onTap: _handleToggleTheme,
                                      child: AnimatedContainer(
                                        duration:
                                            const Duration(milliseconds: 300),
                                        curve:
                                            const Cubic(0.22, 1.0, 0.36, 1.0),
                                        width: _themeExpanded ? 84 : 36,
                                        height: 36,
                                        padding: EdgeInsets.symmetric(
                                          horizontal: _themeExpanded ? 12 : 0,
                                        ),
                                        decoration: BoxDecoration(
                                          color: _themeExpanded
                                              ? palette.cardSurface
                                              : Colors.transparent,
                                          borderRadius:
                                              BorderRadius.circular(999),
                                        ),
                                        child: Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
                                          children: [
                                            AnimatedSwitcher(
                                              duration: const Duration(
                                                  milliseconds: 300),
                                              transitionBuilder:
                                                  (child, animation) {
                                                return RotationTransition(
                                                  turns: Tween<double>(
                                                    begin: 0.75,
                                                    end: 1.0,
                                                  ).animate(animation),
                                                  child: ScaleTransition(
                                                    scale: animation,
                                                    child: FadeTransition(
                                                      opacity: animation,
                                                      child: child,
                                                    ),
                                                  ),
                                                );
                                              },
                                              child: Icon(
                                                widget.isDarkMode
                                                    ? Icons.dark_mode_outlined
                                                    : Icons.light_mode_outlined,
                                                key: ValueKey(widget.isDarkMode),
                                                size: 16,
                                                color: _themeExpanded
                                                    ? palette.gold
                                                    : palette.primaryText
                                                        .withOpacity(0.6),
                                              ),
                                            ),
                                            if (_themeExpanded) ...[
                                              const SizedBox(width: 6),
                                              Flexible(
                                                child: Text(
                                                  widget.isDarkMode
                                                      ? 'DARK'
                                                      : 'LIGHT',
                                                  overflow: TextOverflow.clip,
                                                  maxLines: 1,
                                                  style: OnyxTypography.mono(
                                                    fontSize: 10,
                                                    color: palette.gold,
                                                    letterSpacing: 0.8,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ],
                                        ),
                                      ),
                                    ),
                                  ],
                                ),

                                const SizedBox(width: 4),
                                // Bell Notification Button
                                GestureDetector(
                                  onTap: () => setState(() {
                                    _notificationOpen = !_notificationOpen;
                                  }),
                                  child: Container(
                                    width: 36,
                                    height: 36,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: _notificationOpen
                                          ? palette.hoverFill
                                          : Colors.transparent,
                                    ),
                                    child: Icon(
                                      Icons.notifications_none_rounded,
                                      size: 17,
                                      color: _notificationOpen
                                          ? palette.gold
                                          : palette.primaryText
                                              .withOpacity(0.55),
                                    ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ],
                      ),
                    );
                  },
                ),

                const SizedBox(height: 16),

                // Centered Editorial Stat Block
                Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'TOTAL MONTH SPEND',
                          style: OnyxTypography.mono(
                            fontSize: 10,
                            color: palette.mutedText,
                            letterSpacing: 1.4,
                          ),
                        ),
                        const SizedBox(width: 8),
                        GestureDetector(
                          onTap: () => setState(
                              () => _balanceVisible = !_balanceVisible),
                          child: Icon(
                            _balanceVisible
                                ? Icons.visibility_outlined
                                : Icons.visibility_off_outlined,
                            size: 15,
                            color: palette.primaryText.withOpacity(0.45),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _balanceVisible
                          ? formatINR(totalCombinedSpend)
                          : '••••••••',
                      style: OnyxTypography.editorial(
                        fontSize: 52,
                        fontWeight: FontWeight.w600,
                        height: 1.0,
                        letterSpacing: -1.0,
                        color: palette.primaryText,
                        tabularFigures: true,
                      ),
                    ),
                    const SizedBox(height: 20),

                    // 4px Utilization Progress Track
                    ClipRRect(
                      borderRadius: BorderRadius.circular(2),
                      child: Container(
                        width: double.infinity,
                        height: 4,
                        color: palette.divider,
                        alignment: Alignment.centerLeft,
                        child: AnimatedFractionallySizedBox(
                          duration: const Duration(milliseconds: 300),
                          widthFactor: utilizationPercent / 100.0,
                          heightFactor: 1.0,
                          child: Container(color: palette.gold),
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'LIMIT USED',
                          style: OnyxTypography.mono(
                            fontSize: 9,
                            color: palette.mutedText,
                            letterSpacing: 1.1,
                          ),
                        ),
                        Text(
                          '$utilizationPercent% OF ${_balanceVisible ? formatINR(totalCombinedLimit, compact: true).toUpperCase() : '••••'}',
                          style: OnyxTypography.mono(
                            fontSize: 9,
                            color: palette.primaryText,
                            letterSpacing: 1.1,
                            tabularFigures: true,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),

                const SizedBox(height: 18),

                // Recent Activity Card (Borderless, No Separator Lines)
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: palette.cardSurface,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Recent Activity',
                            style: OnyxTypography.sans(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: palette.primaryText,
                              letterSpacing: -0.2,
                            ),
                          ),
                          if (extraTransactions.isNotEmpty)
                            GestureDetector(
                              onTap: () => setState(() =>
                                  _showAllTransactions = !_showAllTransactions),
                              child: Text(
                                _showAllTransactions ? 'LESS' : 'VIEW ALL',
                                style: OnyxTypography.mono(
                                  fontSize: 10,
                                  color: palette.mutedText,
                                  letterSpacing: 1.0,
                                ),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      if (filteredTransactions.isEmpty)
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 24),
                          child: Text(
                            'No matching transactions found.',
                            textAlign: TextAlign.center,
                            style: OnyxTypography.sans(
                              fontSize: 12,
                              color: palette.mutedText,
                            ),
                          ),
                        )
                      else ...[
                        ...initialTransactions.map(
                          (tx) => _ActivityRow(
                            tx: tx,
                            balanceVisible: _balanceVisible,
                            palette: palette,
                            onTap: () => widget.onSelectTransaction(tx),
                          ),
                        ),

                        // Animated Expandable Extra Rows
                        if (extraTransactions.isNotEmpty)
                          AnimatedSize(
                            duration: const Duration(milliseconds: 300),
                            curve: const Cubic(0.22, 1.0, 0.36, 1.0),
                            alignment: Alignment.topCenter,
                            child: _showAllTransactions
                                ? Column(
                                    children: extraTransactions
                                        .asMap()
                                        .entries
                                        .map(
                                          (entry) => TweenAnimationBuilder<
                                              double>(
                                            key: ValueKey(entry.value.id),
                                            tween:
                                                Tween(begin: 0.0, end: 1.0),
                                            duration: Duration(
                                              milliseconds:
                                                  240 + (entry.key * 35),
                                            ),
                                            curve: const Cubic(
                                                0.22, 1.0, 0.36, 1.0),
                                            builder: (context, val, child) {
                                              return Opacity(
                                                opacity: val,
                                                child: Transform.translate(
                                                  offset:
                                                      Offset(0, -6 * (1 - val)),
                                                  child: child,
                                                ),
                                              );
                                            },
                                            child: _ActivityRow(
                                              tx: entry.value,
                                              balanceVisible: _balanceVisible,
                                              palette: palette,
                                              onTap: () =>
                                                  widget.onSelectTransaction(
                                                      entry.value),
                                            ),
                                          ),
                                        )
                                        .toList(),
                                  )
                                : const SizedBox.shrink(),
                          ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Notification Popover Overlay
          if (_notificationOpen)
            Positioned(
              right: 16,
              top: 52,
              child: Container(
                width: 256,
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: palette.cardSurface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: palette.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.only(bottom: 8),
                      margin: const EdgeInsets.only(bottom: 10),
                      decoration: BoxDecoration(
                        border: Border(bottom: BorderSide(color: palette.divider)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'PORTFOLIO ALERTS',
                            style: OnyxTypography.mono(
                              fontSize: 10,
                              color: palette.primaryText,
                              letterSpacing: 1.1,
                            ),
                          ),
                          Text(
                            'Verified',
                            style: OnyxTypography.mono(
                              fontSize: 10,
                              color: palette.gold,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(
                          Icons.verified_user_outlined,
                          size: 14,
                          color: palette.gold,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'RBI Tokenization Active',
                                style: OnyxTypography.sans(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w500,
                                  color: palette.primaryText,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                'Credentials verified across ${widget.cards.length} Indian banks.',
                                style: OnyxTypography.sans(
                                  fontSize: 10,
                                  color: palette.mutedText,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _ActivityRow extends StatelessWidget {
  final TransactionModel tx;
  final bool balanceVisible;
  final OnyxPalette palette;
  final VoidCallback onTap;

  const _ActivityRow({
    required this.tx,
    required this.balanceVisible,
    required this.palette,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isIncome = tx.type == TransactionType.income;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 9),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Padding(
                padding: const EdgeInsets.only(right: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      tx.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: OnyxTypography.sans(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: palette.primaryText,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${tx.cardBank?.displayName ?? 'Card'} · ${tx.date}',
                      style: OnyxTypography.mono(
                        fontSize: 9,
                        color: palette.subtleText,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Text(
              '${isIncome ? '+' : '-'}${balanceVisible ? formatINR(tx.amount) : '••••'}',
              style: OnyxTypography.sans(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: palette.primaryText,
                tabularFigures: true,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
