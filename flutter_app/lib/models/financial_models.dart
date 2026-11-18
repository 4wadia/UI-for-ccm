enum ScreenId { home, cards }

enum IndianBank {
  hdfc('HDFC Bank'),
  icici('ICICI Bank'),
  sbi('SBI Card'),
  axis('Axis Bank'),
  kotak('Kotak Mahindra Bank'),
  indusInd('IndusInd Bank'),
  bob('Bank of Baroda'),
  pnb('Punjab National Bank'),
  idfcFirst('IDFC FIRST Bank'),
  rbl('RBL Bank'),
  yesBank('Yes Bank'),
  auSmallFinance('AU Small Finance Bank'),
  federal('Federal Bank');

  final String displayName;
  const IndianBank(this.displayName);

  String get shortName => displayName
      .replaceAll(' Mahindra Bank', '')
      .replaceAll(' Small Finance Bank', '')
      .replaceAll(' Bank', '')
      .replaceAll(' Card', '');
}

enum CardSupplier {
  rupay('RuPay'),
  visa('VISA'),
  mastercard('Mastercard'),
  amex('AMEX'),
  diners('Diners');

  final String label;
  const CardSupplier(this.label);

  String get tag => switch (this) {
        CardSupplier.visa => 'VISA',
        CardSupplier.rupay => 'RUPAY',
        CardSupplier.mastercard => 'MC',
        CardSupplier.amex => 'AMEX',
        CardSupplier.diners => 'DINERS',
      };
}

enum TransactionType { expense, income }

enum TransactionStatus { completed, pending }

class TransactionModel {
  final String id;
  final String title;
  final String category;
  final double amount;
  final TransactionType type;
  final String date;
  final String time;
  final String cardLast4;
  final IndianBank? cardBank;
  final CardSupplier? cardBrand;
  final String merchant;
  final String referenceId;
  final TransactionStatus status;
  final bool isUpi;

  const TransactionModel({
    required this.id,
    required this.title,
    required this.category,
    required this.amount,
    required this.type,
    required this.date,
    required this.time,
    required this.cardLast4,
    this.cardBank,
    this.cardBrand,
    required this.merchant,
    required this.referenceId,
    this.status = TransactionStatus.completed,
    this.isUpi = false,
  });
}

class CreditCardModel {
  final String id;
  final IndianBank bankName;
  final String holderName;
  final String cardNumber;
  final String maskedNumber;
  final String expiry;
  final String cvv;
  final double balance;
  final double limit;
  final CardSupplier brand;
  final String cardTier;
  final int? cardColorValue;
  final bool? isLightCard;
  final bool isFrozen;
  final double dailyLimit;
  final double currentDailySpent;
  final bool contactlessEnabled;
  final bool onlinePaymentsEnabled;
  final bool internationalEnabled;

  const CreditCardModel({
    required this.id,
    required this.bankName,
    required this.holderName,
    required this.cardNumber,
    required this.maskedNumber,
    required this.expiry,
    required this.cvv,
    required this.balance,
    required this.limit,
    required this.brand,
    required this.cardTier,
    this.cardColorValue,
    this.isLightCard,
    this.isFrozen = false,
    required this.dailyLimit,
    this.currentDailySpent = 0,
    this.contactlessEnabled = true,
    this.onlinePaymentsEnabled = true,
    this.internationalEnabled = true,
  });

  CreditCardModel copyWith({
    bool? isFrozen,
    double? dailyLimit,
    bool? contactlessEnabled,
    bool? onlinePaymentsEnabled,
  }) {
    return CreditCardModel(
      id: id,
      bankName: bankName,
      holderName: holderName,
      cardNumber: cardNumber,
      maskedNumber: maskedNumber,
      expiry: expiry,
      cvv: cvv,
      balance: balance,
      limit: limit,
      brand: brand,
      cardTier: cardTier,
      cardColorValue: cardColorValue,
      isLightCard: isLightCard,
      isFrozen: isFrozen ?? this.isFrozen,
      dailyLimit: dailyLimit ?? this.dailyLimit,
      currentDailySpent: currentDailySpent,
      contactlessEnabled: contactlessEnabled ?? this.contactlessEnabled,
      onlinePaymentsEnabled:
          onlinePaymentsEnabled ?? this.onlinePaymentsEnabled,
      internationalEnabled: internationalEnabled,
    );
  }
}
