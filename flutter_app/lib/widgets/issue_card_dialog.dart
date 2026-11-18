import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/financial_models.dart';
import '../theme/onyx_theme.dart';
import '../utils/card_helpers.dart';

Future<void> showIssueCardDialog({
  required BuildContext context,
  required bool isDarkMode,
  required ValueChanged<CreditCardModel> onAddCard,
}) {
  return showDialog<void>(
    context: context,
    barrierColor: Colors.black.withOpacity(0.6),
    builder: (ctx) => _IssueCardDialog(
      isDarkMode: isDarkMode,
      onAddCard: onAddCard,
    ),
  );
}

class _IssueCardDialog extends StatefulWidget {
  final bool isDarkMode;
  final ValueChanged<CreditCardModel> onAddCard;

  const _IssueCardDialog({
    required this.isDarkMode,
    required this.onAddCard,
  });

  @override
  State<_IssueCardDialog> createState() => _IssueCardDialogState();
}

class _IssueCardDialogState extends State<_IssueCardDialog> {
  final _formKey = GlobalKey<FormState>();
  final _cardNumberController = TextEditingController();
  final _holderController = TextEditingController(text: 'Arjun Sharma');
  final _limitController = TextEditingController(text: '300000');

  IndianBank _selectedBank = IndianBank.hdfc;
  late String _selectedVariantName;

  @override
  void initState() {
    super.initState();
    _selectedVariantName = bankCardVariants[_selectedBank]!.first.name;
    _cardNumberController.addListener(_onFieldUpdated);
    _holderController.addListener(_onFieldUpdated);
  }

  void _onFieldUpdated() {
    if (mounted) setState(() {});
  }

  @override
  void dispose() {
    _cardNumberController.dispose();
    _holderController.dispose();
    _limitController.dispose();
    super.dispose();
  }

  List<CardVariantPreset> get _bankVariants =>
      bankCardVariants[_selectedBank] ?? const [];

  CardVariantPreset get _selectedVariant => _bankVariants.firstWhere(
        (v) => v.name == _selectedVariantName,
        orElse: () => _bankVariants.first,
      );

  CardSupplier? get _detectedBrand =>
      detectCardBrandFromNumber(_cardNumberController.text);

  CardSupplier get _resolvedBrand =>
      _detectedBrand ?? _selectedVariant.defaultBrand;

  CardColorMatch get _originalColor => fetchOriginalCardColor(
        _selectedBank,
        _selectedVariant.name,
        _resolvedBrand,
      );

  void _handleBankChange(IndianBank bank) {
    setState(() {
      _selectedBank = bank;
      _selectedVariantName = bankCardVariants[bank]!.first.name;
    });
  }

  void _handleSubmit() {
    if (!(_formKey.currentState?.validate() ?? false)) return;

    final random = Random();
    final digits = _cardNumberController.text.replaceAll(RegExp(r'\D'), '');
    final last4 = digits.length >= 4
        ? digits.substring(digits.length - 4)
        : (1000 + random.nextInt(9000)).toString();

    final prefix = switch (_resolvedBrand) {
      CardSupplier.visa => '4532',
      CardSupplier.mastercard => '5421',
      CardSupplier.rupay => '6521',
      CardSupplier.diners => '3612',
      CardSupplier.amex => '3742',
    };

    final cleanNumber = digits.length >= 12
        ? formatCardNumberInput(digits, _resolvedBrand)
        : '$prefix ${1000 + random.nextInt(9000)} ${1000 + random.nextInt(9000)} $last4';

    final numericLimit =
        max(10000.0, double.tryParse(_limitController.text.trim()) ?? 300000.0);
    final holder = _holderController.text.trim().isEmpty
        ? 'Arjun Sharma'
        : _holderController.text.trim();
    final original = _originalColor;

    final newCard = CreditCardModel(
      id: 'card-${DateTime.now().millisecondsSinceEpoch}',
      bankName: _selectedBank,
      holderName: holder,
      cardNumber: cleanNumber,
      maskedNumber: '•••• $last4',
      expiry: '09/30',
      cvv: (100 + random.nextInt(900)).toString(),
      balance: 0,
      limit: numericLimit,
      brand: _resolvedBrand,
      cardTier: '${_selectedBank.shortName} ${_selectedVariant.name}',
      cardColorValue: original.color.value,
      isLightCard: original.isLight,
      dailyLimit: (numericLimit * 0.25).roundToDouble(),
      internationalEnabled: _resolvedBrand != CardSupplier.rupay,
    );

    widget.onAddCard(newCard);
    Navigator.of(context).pop();
  }

  InputDecoration _inputDecoration(
    OnyxPalette palette, {
    String? hint,
    Widget? suffixIcon,
  }) {
    final borderSide = BorderSide(color: palette.border, width: 1);
    final focusedBorder = BorderSide(color: palette.gold, width: 1);

    return InputDecoration(
      hintText: hint,
      hintStyle: OnyxTypography.sans(
        fontSize: 12,
        color: palette.primaryText.withOpacity(0.38),
      ),
      filled: true,
      fillColor: widget.isDarkMode ? const Color(0xFF000000) : Colors.white,
      isDense: true,
      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 11),
      suffixIcon: suffixIcon,
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: borderSide,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: focusedBorder,
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFFEF4444), width: 1),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFFEF4444), width: 1),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final palette = OnyxPalette(widget.isDarkMode);
    final original = _originalColor;
    final previewInk =
        original.isLight ? const Color(0xFF111113) : const Color(0xFFF8F7F4);
    final digits = _cardNumberController.text.replaceAll(RegExp(r'\D'), '');
    final previewLast4 =
        digits.length >= 4 ? digits.substring(digits.length - 4) : '8824';

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 390),
        child: Container(
          decoration: BoxDecoration(
            color: palette.modalSurface,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: palette.border),
          ),
          padding: const EdgeInsets.all(20),
          child: SingleChildScrollView(
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Header
                  Container(
                    padding: const EdgeInsets.only(bottom: 14),
                    margin: const EdgeInsets.only(bottom: 16),
                    decoration: BoxDecoration(
                      border: Border(bottom: BorderSide(color: palette.divider)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'NEW PORTFOLIO INSTRUMENT',
                              style: OnyxTypography.mono(
                                fontSize: 9,
                                color: palette.gold,
                                letterSpacing: 1.1,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Issue Card',
                              style: OnyxTypography.editorial(
                                fontSize: 24,
                                fontWeight: FontWeight.w600,
                                color: palette.primaryText,
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
                              color: palette.primaryText.withOpacity(0.75),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Live Original Design Preview
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'ORIGINAL DESIGN',
                        style: OnyxTypography.mono(
                          fontSize: 9,
                          color: palette.mutedText,
                          letterSpacing: 1.0,
                        ),
                      ),
                      Text(
                        original.label.toUpperCase(),
                        style: OnyxTypography.mono(
                          fontSize: 9,
                          color: palette.gold,
                          letterSpacing: 1.0,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    height: 112,
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: original.color,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  'O',
                                  style: OnyxTypography.editorial(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w700,
                                    fontStyle: FontStyle.italic,
                                    color: original.accentColor ?? previewInk,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  _selectedBank.displayName,
                                  style: OnyxTypography.sans(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: previewInk,
                                  ),
                                ),
                              ],
                            ),
                            Text(
                              _selectedVariant.name.toUpperCase(),
                              style: OnyxTypography.mono(
                                fontSize: 9,
                                color: previewInk.withOpacity(0.75),
                                letterSpacing: 1.0,
                              ),
                            ),
                          ],
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  _holderController.text.trim().isEmpty
                                      ? 'Arjun Sharma'
                                      : _holderController.text.trim(),
                                  style: OnyxTypography.sans(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w500,
                                    color: previewInk,
                                  ),
                                ),
                                Text(
                                  '•••• $previewLast4',
                                  style: OnyxTypography.mono(
                                    fontSize: 10,
                                    color: previewInk.withOpacity(0.75),
                                    letterSpacing: 1.4,
                                  ),
                                ),
                              ],
                            ),
                            Text(
                              _resolvedBrand.label.toUpperCase(),
                              style: OnyxTypography.mono(
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                                color: previewInk,
                                letterSpacing: 1.0,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Card Number Input with BIN detection badge
                  Text(
                    'CARD NUMBER',
                    style: OnyxTypography.mono(
                      fontSize: 10,
                      color: palette.mutedText,
                      letterSpacing: 1.0,
                    ),
                  ),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _cardNumberController,
                    keyboardType: TextInputType.number,
                    inputFormatters: [_CardNumberTextFormatter()],
                    style: OnyxTypography.mono(
                      fontSize: 12,
                      color: palette.primaryText,
                      letterSpacing: 1.1,
                      tabularFigures: true,
                    ),
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) {
                        return 'Enter card number';
                      }
                      return null;
                    },
                    decoration: _inputDecoration(
                      palette,
                      hint: '4532 •••• •••• ••••',
                      suffixIcon: Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 3,
                              ),
                              decoration: BoxDecoration(
                                color: _detectedBrand != null
                                    ? (widget.isDarkMode
                                        ? const Color(0xFFD4AF37)
                                        : const Color(0xFF111113))
                                    : Colors.transparent,
                                borderRadius: BorderRadius.circular(3),
                              ),
                              child: Text(
                                _resolvedBrand.label,
                                style: OnyxTypography.mono(
                                  fontSize: 10,
                                  fontWeight: _detectedBrand != null
                                      ? FontWeight.w600
                                      : FontWeight.w400,
                                  color: _detectedBrand != null
                                      ? (widget.isDarkMode
                                          ? const Color(0xFF111113)
                                          : const Color(0xFFF8F7F4))
                                      : palette.mutedText,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Issuing Bank & Card Variant (Selection Lists Only)
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'ISSUING BANK',
                              style: OnyxTypography.mono(
                                fontSize: 10,
                                color: palette.mutedText,
                                letterSpacing: 1.0,
                              ),
                            ),
                            const SizedBox(height: 6),
                            DropdownButtonFormField<IndianBank>(
                              value: _selectedBank,
                              isExpanded: true,
                              dropdownColor: palette.cardSurface,
                              style: OnyxTypography.sans(
                                fontSize: 12,
                                color: palette.primaryText,
                              ),
                              decoration: _inputDecoration(palette),
                              items: IndianBank.values
                                  .map(
                                    (bank) => DropdownMenuItem(
                                      value: bank,
                                      child: Text(
                                        bank.displayName,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                  )
                                  .toList(),
                              onChanged: (bank) {
                                if (bank != null) _handleBankChange(bank);
                              },
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'CARD VARIANT',
                              style: OnyxTypography.mono(
                                fontSize: 10,
                                color: palette.mutedText,
                                letterSpacing: 1.0,
                              ),
                            ),
                            const SizedBox(height: 6),
                            DropdownButtonFormField<String>(
                              value: _selectedVariant.name,
                              isExpanded: true,
                              dropdownColor: palette.cardSurface,
                              style: OnyxTypography.sans(
                                fontSize: 12,
                                color: palette.primaryText,
                              ),
                              decoration: _inputDecoration(palette),
                              items: _bankVariants
                                  .map(
                                    (variant) => DropdownMenuItem(
                                      value: variant.name,
                                      child: Text(
                                        variant.name,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                  )
                                  .toList(),
                              onChanged: (name) {
                                if (name != null) {
                                  setState(() => _selectedVariantName = name);
                                }
                              },
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Cardholder & Limit
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'CARDHOLDER',
                              style: OnyxTypography.mono(
                                fontSize: 10,
                                color: palette.mutedText,
                                letterSpacing: 1.0,
                              ),
                            ),
                            const SizedBox(height: 6),
                            TextFormField(
                              controller: _holderController,
                              style: OnyxTypography.sans(
                                fontSize: 12,
                                color: palette.primaryText,
                              ),
                              validator: (val) =>
                                  (val == null || val.trim().isEmpty)
                                      ? 'Required'
                                      : null,
                              decoration:
                                  _inputDecoration(palette, hint: 'Arjun Sharma'),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'LIMIT (₹)',
                              style: OnyxTypography.mono(
                                fontSize: 10,
                                color: palette.mutedText,
                                letterSpacing: 1.0,
                              ),
                            ),
                            const SizedBox(height: 6),
                            TextFormField(
                              controller: _limitController,
                              keyboardType: TextInputType.number,
                              inputFormatters: [
                                FilteringTextInputFormatter.digitsOnly,
                              ],
                              style: OnyxTypography.mono(
                                fontSize: 12,
                                color: palette.primaryText,
                                tabularFigures: true,
                              ),
                              validator: (val) {
                                final parsed = int.tryParse(val ?? '') ?? 0;
                                if (parsed < 10000) return 'Min ₹10,000';
                                return null;
                              },
                              decoration:
                                  _inputDecoration(palette, hint: '300000'),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),

                  // Submit Button
                  SizedBox(
                    height: 44,
                    child: ElevatedButton(
                      onPressed: _handleSubmit,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: widget.isDarkMode
                            ? const Color(0xFFD4AF37)
                            : const Color(0xFF111113),
                        foregroundColor: widget.isDarkMode
                            ? const Color(0xFF111113)
                            : const Color(0xFFF8F7F4),
                        elevation: 0,
                        shape: const StadiumBorder(),
                      ),
                      child: Text(
                        '+ Issue Card',
                        style: OnyxTypography.sans(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _CardNumberTextFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    final brand = detectCardBrandFromNumber(newValue.text);
    final formatted = formatCardNumberInput(newValue.text, brand);
    return TextEditingValue(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}
