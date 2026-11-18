import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/financial_models.dart';
import '../theme/onyx_theme.dart';
import '../utils/format_currency.dart';

Future<void> showTransactionDetailSheet({
  required BuildContext context,
  required TransactionModel transaction,
  required bool isDarkMode,
}) {
  return showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    barrierColor: Colors.black.withValues(alpha: 0.6),
    builder: (ctx) => _TransactionDetailSheet(
      transaction: transaction,
      isDarkMode: isDarkMode,
    ),
  );
}

class _TransactionDetailSheet extends StatefulWidget {
  final TransactionModel transaction;
  final bool isDarkMode;

  const _TransactionDetailSheet({
    required this.transaction,
    required this.isDarkMode,
  });

  @override
  State<_TransactionDetailSheet> createState() =>
      _TransactionDetailSheetState();
}

class _TransactionDetailSheetState extends State<_TransactionDetailSheet> {
  bool _copied = false;
  Timer? _timer;

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _copyReference() async {
    await Clipboard.setData(
      ClipboardData(text: widget.transaction.referenceId),
    );
    if (!mounted) return;
    setState(() => _copied = true);
    _timer?.cancel();
    _timer = Timer(const Duration(seconds: 2), () {
      if (mounted) setState(() => _copied = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    final palette = OnyxPalette(widget.isDarkMode);
    final tx = widget.transaction;
    final isIncome = tx.type == TransactionType.income;

    return SafeArea(
      top: false,
      child: Center(
        heightFactor: 1.0,
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 400),
          child: Container(
            decoration: BoxDecoration(
              color: palette.modalSurface,
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(28),
              ),
              border: Border.all(color: palette.border),
            ),
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Text(
                          'TRANSACTION RECEIPT',
                          style: OnyxTypography.mono(
                            fontSize: 10,
                            color: palette.mutedText,
                            letterSpacing: 1.2,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          '· Verified',
                          style: OnyxTypography.mono(
                            fontSize: 10,
                            color: const Color(0xFFD4AF37),
                          ),
                        ),
                      ],
                    ),
                    InkWell(
                      onTap: () => Navigator.of(context).pop(),
                      borderRadius: BorderRadius.circular(999),
                      child: Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: palette.border),
                        ),
                        child: Icon(
                          Icons.close,
                          size: 16,
                          color: palette.primaryText,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Amount Block
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 20),
                  decoration: BoxDecoration(
                    border: Border(bottom: BorderSide(color: palette.divider)),
                  ),
                  child: Column(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: widget.isDarkMode
                                ? const Color(0xFFD4AF37)
                                : const Color(0xFF111113),
                          ),
                        ),
                        child: Icon(
                          isIncome ? Icons.south_west : Icons.north_east,
                          size: 20,
                          color: widget.isDarkMode
                              ? const Color(0xFFD4AF37)
                              : const Color(0xFF111113),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        '${isIncome ? '+' : '-'}${formatINR(tx.amount)}',
                        style: OnyxTypography.editorial(
                          fontSize: 36,
                          fontWeight: FontWeight.w600,
                          color: palette.primaryText,
                          tabularFigures: true,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        tx.title,
                        style: OnyxTypography.sans(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: palette.primaryText,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        tx.date.toUpperCase(),
                        style: OnyxTypography.mono(
                          fontSize: 10,
                          color: palette.subtleText,
                          letterSpacing: 1.0,
                        ),
                      ),
                    ],
                  ),
                ),

                // Breakdown Rows
                Container(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  decoration: BoxDecoration(
                    border: Border(bottom: BorderSide(color: palette.divider)),
                  ),
                  child: Column(
                    children: [
                      _BreakdownRow(
                        label: 'Status',
                        palette: palette,
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.check_circle_outline,
                              size: 14,
                              color: Color(0xFFD4AF37),
                            ),
                            const SizedBox(width: 6),
                            Text(
                              'Completed & Settled',
                              style: OnyxTypography.sans(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: palette.primaryText,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),
                      _BreakdownRow(
                        label: 'Category',
                        palette: palette,
                        value: tx.category,
                      ),
                      const SizedBox(height: 12),
                      _BreakdownRow(
                        label: 'Card',
                        palette: palette,
                        value:
                            '${tx.cardBank?.displayName ?? 'Indian Bank Card'} · •••• ${tx.cardLast4}',
                      ),
                      const SizedBox(height: 12),
                      _BreakdownRow(
                        label: 'Merchant',
                        palette: palette,
                        value: tx.merchant,
                      ),
                      const SizedBox(height: 12),
                      _BreakdownRow(
                        label: 'Reference',
                        palette: palette,
                        trailing: GestureDetector(
                          onTap: _copyReference,
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                tx.referenceId,
                                style: OnyxTypography.mono(
                                  fontSize: 11,
                                  color: palette.primaryText,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Icon(
                                Icons.copy_outlined,
                                size: 12,
                                color: palette.primaryText.withValues(alpha: 0.6),
                              ),
                              if (_copied) ...[
                                const SizedBox(width: 6),
                                Text(
                                  'Copied',
                                  style: OnyxTypography.mono(
                                    fontSize: 10,
                                    color: const Color(0xFFD4AF37),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Actions
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: _copyReference,
                        icon: const Icon(Icons.download_outlined, size: 14),
                        label: Text(
                          'Save Copy',
                          style: OnyxTypography.sans(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: palette.primaryText,
                          side: BorderSide(color: palette.border),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: const StadiumBorder(),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: _copyReference,
                        icon: const Icon(Icons.share_outlined, size: 14),
                        label: Text(
                          'Share Receipt',
                          style: OnyxTypography.sans(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: widget.isDarkMode
                              ? const Color(0xFFF8F7F4)
                              : const Color(0xFF111113),
                          foregroundColor: widget.isDarkMode
                              ? const Color(0xFF111113)
                              : const Color(0xFFF8F7F4),
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: const StadiumBorder(),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _BreakdownRow extends StatelessWidget {
  final String label;
  final String? value;
  final Widget? trailing;
  final OnyxPalette palette;

  const _BreakdownRow({
    required this.label,
    required this.palette,
    this.value,
    this.trailing,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: OnyxTypography.sans(
            fontSize: 12,
            color: palette.mutedText,
          ),
        ),
        const SizedBox(width: 12),
        Flexible(
          child: trailing ??
              Text(
                value ?? '',
                textAlign: TextAlign.right,
                overflow: TextOverflow.ellipsis,
                style: OnyxTypography.sans(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: palette.primaryText,
                ),
              ),
        ),
      ],
    );
  }
}
