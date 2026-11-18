import 'dart:math';
import 'package:flutter/material.dart';
import '../models/financial_models.dart';
import '../theme/onyx_theme.dart';
import '../utils/format_currency.dart';
import '../widgets/physical_credit_card.dart';

class _CardRecentTx {
  final String id;
  final String name;
  final String date;
  final double amount;
  final String status;
  final Color iconBg;
  final Color iconFg;
  final String iconChar;

  const _CardRecentTx({
    required this.id,
    required this.name,
    required this.date,
    required this.amount,
    required this.status,
    required this.iconBg,
    this.iconFg = Colors.white,
    required this.iconChar,
  });
}

class ManageCardScreen extends StatefulWidget {
  final CreditCardModel card;
  final List<TransactionModel> transactions;
  final VoidCallback onBack;
  final bool isDarkMode;

  const ManageCardScreen({
    super.key,
    required this.card,
    this.transactions = const [],
    required this.onBack,
    required this.isDarkMode,
  });

  @override
  State<ManageCardScreen> createState() => _ManageCardScreenState();
}

class _ManageCardScreenState extends State<ManageCardScreen> {
  bool _balanceVisible = true;
  bool _showAllTransactions = false;

  @override
  Widget build(BuildContext context) {
    final palette = OnyxPalette(widget.isDarkMode);
    final card = widget.card;
    final cardSpent = card.balance;
    final availableBalance = max(0.0, card.limit - cardSpent);

    final tierLower = card.cardTier.toLowerCase();
    final isCashbackCard = tierLower.contains('amazon') ||
        tierLower.contains('millennia') ||
        tierLower.contains('cashback') ||
        tierLower.contains('flipkart') ||
        tierLower.contains('ace');

    final statementCashback = max(120, (cardSpent * 0.025).round());
    final totalCashback = max(1200, (cardSpent * 0.025 * 8.4).round());
    final statementPoints = max(250, ((cardSpent / 150).round() * 4));
    final totalPoints = max(2400, ((cardSpent / 150).round() * 38));

    final cardRecentTransactions = <_CardRecentTx>[
      const _CardRecentTx(
        id: 'tx-starbucks',
        name: 'Starbucks Reserve',
        date: '21/11/26 · 08:32',
        amount: 480,
        status: 'Settled',
        iconBg: Color(0xFF006241),
        iconChar: 'S',
      ),
      const _CardRecentTx(
        id: 'tx-swiggy',
        name: 'Swiggy Instamart',
        date: '20/11/26 · 19:14',
        amount: 1280,
        status: 'Settled',
        iconBg: Color(0xFFD4AF37),
        iconFg: Color(0xFF111113),
        iconChar: 'I',
      ),
      _CardRecentTx(
        id: 'tx-netflix',
        name: 'Netflix India',
        date: '18/11/26 · 11:05',
        amount: 649,
        status: 'Settled',
        iconBg: widget.isDarkMode
            ? const Color(0xFF2C2C32)
            : const Color(0xFF1C1D21),
        iconChar: 'N',
      ),
      ...widget.transactions.map(
        (tx) => _CardRecentTx(
          id: tx.id,
          name: tx.title,
          date: tx.date,
          amount: tx.amount,
          status:
              tx.status == TransactionStatus.completed ? 'Settled' : 'Pending',
          iconBg: widget.isDarkMode
              ? const Color(0xFF2C2C32)
              : const Color(0xFF111113),
          iconChar:
              tx.title.isNotEmpty ? tx.title.substring(0, 1).toUpperCase() : 'O',
        ),
      ),
    ];

    final initialCardTransactions = cardRecentTransactions.take(3).toList();
    final extraCardTransactions = cardRecentTransactions.skip(3).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(16, 10, 16, 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Top Navigation Bar
          SizedBox(
            height: 36,
            child: Stack(
              alignment: Alignment.center,
              children: [
                Align(
                  alignment: Alignment.centerLeft,
                  child: GestureDetector(
                    onTap: widget.onBack,
                    child: Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: widget.isDarkMode
                            ? Colors.white.withOpacity(0.04)
                            : Colors.white,
                      ),
                      child: Icon(
                        Icons.chevron_left,
                        size: 20,
                        color: palette.primaryText,
                      ),
                    ),
                  ),
                ),
                Text(
                  'Manage Card',
                  style: OnyxTypography.editorial(
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                    color: palette.primaryText,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),

          // Hero Physical Card (Original Color)
          PhysicalCreditCard(card: card),
          const SizedBox(height: 8),

          // Two-Column Grid: Available & Payment Due
          IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: palette.cardSurface,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SizedBox(
                          height: 24,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'AVAILABLE',
                                style: OnyxTypography.mono(
                                  fontSize: 9,
                                  color: palette.mutedText,
                                  letterSpacing: 0.9,
                                ),
                              ),
                              GestureDetector(
                                onTap: () => setState(
                                    () => _balanceVisible = !_balanceVisible),
                                child: Icon(
                                  _balanceVisible
                                      ? Icons.visibility_outlined
                                      : Icons.visibility_off_outlined,
                                  size: 14,
                                  color: palette.mutedText,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _balanceVisible
                              ? formatINR(availableBalance)
                              : '••••••••',
                          style: OnyxTypography.sans(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: palette.primaryText,
                            tabularFigures: true,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'of ${_balanceVisible ? formatINR(card.limit, compact: true) : '••••'}',
                          style: OnyxTypography.mono(
                            fontSize: 9,
                            color: palette.mutedText,
                            tabularFigures: true,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: palette.cardSurface,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SizedBox(
                          height: 24,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'PAYMENT DUE',
                                style: OnyxTypography.mono(
                                  fontSize: 9,
                                  color: palette.mutedText,
                                  letterSpacing: 0.9,
                                ),
                              ),
                              Text(
                                '1 Oct',
                                style: OnyxTypography.mono(
                                  fontSize: 9,
                                  fontWeight: FontWeight.w600,
                                  color: palette.gold,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          formatINR(cardSpent),
                          style: OnyxTypography.sans(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: palette.primaryText,
                            tabularFigures: true,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),

          // Two-Column Grid: Statement & Total Cashback / Rewards
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: palette.cardSurface,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        isCashbackCard
                            ? 'STATEMENT CASHBACK'
                            : 'STATEMENT REWARDS',
                        style: OnyxTypography.mono(
                          fontSize: 9,
                          color: palette.mutedText,
                          letterSpacing: 0.9,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        isCashbackCard
                            ? formatINR(statementCashback)
                            : '${formatIndianNumber(statementPoints)} pts',
                        style: OnyxTypography.sans(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: palette.primaryText,
                          tabularFigures: true,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: palette.cardSurface,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        isCashbackCard ? 'TOTAL CASHBACK' : 'TOTAL REWARDS',
                        style: OnyxTypography.mono(
                          fontSize: 9,
                          color: palette.mutedText,
                          letterSpacing: 0.9,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        isCashbackCard
                            ? formatINR(totalCashback)
                            : '${formatIndianNumber(totalPoints)} pts',
                        style: OnyxTypography.sans(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: palette.primaryText,
                          tabularFigures: true,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Recent Transactions Card
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: palette.cardSurface,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Recent Transactions',
                      style: OnyxTypography.sans(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: palette.primaryText,
                      ),
                    ),
                    if (extraCardTransactions.isNotEmpty)
                      GestureDetector(
                        onTap: () => setState(() =>
                            _showAllTransactions = !_showAllTransactions),
                        child: Text(
                          _showAllTransactions ? 'SHOW LESS' : 'VIEW ALL',
                          style: OnyxTypography.mono(
                            fontSize: 9,
                            color: palette.mutedText,
                            letterSpacing: 0.9,
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 8),

                ...initialCardTransactions.map(
                  (tx) => _CardTxRow(
                    tx: tx,
                    palette: palette,
                    isDarkMode: widget.isDarkMode,
                  ),
                ),

                if (extraCardTransactions.isNotEmpty)
                  AnimatedSize(
                    duration: const Duration(milliseconds: 300),
                    curve: const Cubic(0.22, 1.0, 0.36, 1.0),
                    alignment: Alignment.topCenter,
                    child: _showAllTransactions
                        ? Column(
                            children: extraCardTransactions
                                .asMap()
                                .entries
                                .map(
                                  (entry) => TweenAnimationBuilder<double>(
                                    key: ValueKey(entry.value.id),
                                    tween: Tween(begin: 0.0, end: 1.0),
                                    duration: Duration(
                                      milliseconds: 240 + (entry.key * 35),
                                    ),
                                    curve: const Cubic(0.22, 1.0, 0.36, 1.0),
                                    builder: (context, val, child) {
                                      return Opacity(
                                        opacity: val,
                                        child: Transform.translate(
                                          offset: Offset(0, -6 * (1 - val)),
                                          child: child,
                                        ),
                                      );
                                    },
                                    child: _CardTxRow(
                                      tx: entry.value,
                                      palette: palette,
                                      isDarkMode: widget.isDarkMode,
                                    ),
                                  ),
                                )
                                .toList(),
                          )
                        : const SizedBox.shrink(),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _CardTxRow extends StatelessWidget {
  final _CardRecentTx tx;
  final OnyxPalette palette;
  final bool isDarkMode;

  const _CardTxRow({
    required this.tx,
    required this.palette,
    required this.isDarkMode,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: tx.iconBg,
                ),
                alignment: Alignment.center,
                child: Text(
                  tx.iconChar,
                  style: OnyxTypography.sans(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: tx.iconFg,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    tx.name,
                    style: OnyxTypography.sans(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: palette.primaryText,
                    ),
                  ),
                  const SizedBox(height: 1),
                  Text(
                    tx.date,
                    style: OnyxTypography.mono(
                      fontSize: 9,
                      color: palette.subtleText,
                    ),
                  ),
                ],
              ),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '-${formatINR(tx.amount)}',
                style: OnyxTypography.sans(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: palette.primaryText,
                  tabularFigures: true,
                ),
              ),
              Text(
                tx.status.toUpperCase(),
                style: OnyxTypography.mono(
                  fontSize: 8,
                  color: isDarkMode
                      ? const Color(0xFF34D399)
                      : const Color(0xFF047857),
                  letterSpacing: 0.7,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
