/// Formats Indian Rupee (INR / ₹) values using the Indian numbering system
/// (Lakhs / Crores grouping: ##,##,###) or compact L / Cr / K notation.
String formatINR(
  num amount, {
  bool? showDecimals,
  bool compact = false,
}) {
  if (compact) {
    final abs = amount.abs();
    if (abs >= 10000000) {
      final formatted =
          (amount / 10000000).toStringAsFixed(2).replaceFirst(RegExp(r'\.00$'), '');
      return '₹$formatted Cr';
    }
    if (abs >= 100000) {
      final formatted =
          (amount / 100000).toStringAsFixed(2).replaceFirst(RegExp(r'\.00$'), '');
      return '₹$formatted L';
    }
    if (abs >= 1000) {
      final formatted =
          (amount / 1000).toStringAsFixed(1).replaceFirst(RegExp(r'\.0$'), '');
      return '₹$formatted K';
    }
  }

  final hasDecimals = showDecimals ?? (amount % 1 != 0);
  final isNegative = amount < 0;
  final fixed = amount.abs().toStringAsFixed(hasDecimals ? 2 : 0);
  final parts = fixed.split('.');
  final integerGrouped = _groupIndianDigits(parts[0]);
  final decimalPart = hasDecimals && parts.length > 1 ? '.${parts[1]}' : '';

  return '${isNegative ? '-' : ''}₹$integerGrouped$decimalPart';
}

/// Formats plain integer counts (e.g. reward points) with Indian digit grouping.
String formatIndianNumber(int value) {
  final isNegative = value < 0;
  final grouped = _groupIndianDigits(value.abs().toString());
  return '${isNegative ? '-' : ''}$grouped';
}

String _groupIndianDigits(String digits) {
  if (digits.length <= 3) return digits;
  final lastThree = digits.substring(digits.length - 3);
  final remaining = digits.substring(0, digits.length - 3);
  final buffer = StringBuffer();
  for (int i = 0; i < remaining.length; i++) {
    final posFromRight = remaining.length - i;
    buffer.write(remaining[i]);
    if (posFromRight > 1 && posFromRight % 2 == 1) {
      buffer.write(',');
    }
  }
  return '$buffer,$lastThree';
}
