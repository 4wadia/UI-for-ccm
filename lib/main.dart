import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'data/mock_financial_data.dart';
import 'models/financial_models.dart';
import 'screens/cards_screen.dart';
import 'screens/home_screen.dart';
import 'screens/manage_card_screen.dart';
import 'theme/onyx_theme.dart';
import 'widgets/floating_pill_nav.dart';
import 'widgets/galaxy_s26_ultra_frame.dart';
import 'widgets/issue_card_dialog.dart';
import 'widgets/transaction_detail_sheet.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const OnyxCardsApp());
}

class OnyxCardsApp extends StatefulWidget {
  const OnyxCardsApp({super.key});

  @override
  State<OnyxCardsApp> createState() => _OnyxCardsAppState();
}

class _OnyxCardsAppState extends State<OnyxCardsApp> {
  bool _isDarkMode = true;
  ScreenId _activeTab = ScreenId.home;
  CreditCardModel? _selectedCardForManage;
  List<CreditCardModel> _cards = List.of(initialCards);
  final List<TransactionModel> _transactions = List.of(initialTransactions);
  String? _statusPillMessage;
  Timer? _toastTimer;

  @override
  void dispose() {
    _toastTimer?.cancel();
    super.dispose();
  }

  void _showStatusToast(String message) {
    setState(() => _statusPillMessage = message);
    _toastTimer?.cancel();
    _toastTimer = Timer(const Duration(seconds: 3), () {
      if (mounted) setState(() => _statusPillMessage = null);
    });
  }

  void _handleAddCard(CreditCardModel newCard) {
    setState(() {
      _cards = [newCard, ..._cards];
    });
    _showStatusToast('New ${newCard.cardTier} Issued');
  }

  @override
  Widget build(BuildContext context) {
    final palette = OnyxPalette(_isDarkMode);

    SystemChrome.setSystemUIOverlayStyle(
      _isDarkMode ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark,
    );

    return MaterialApp(
      title: 'Onyx Cards',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: _isDarkMode ? Brightness.dark : Brightness.light,
        scaffoldBackgroundColor: palette.background,
        useMaterial3: true,
      ),
      builder: (context, child) {
        return GalaxyS26UltraFrame(
          isDarkMode: _isDarkMode,
          child: child ?? const SizedBox.shrink(),
        );
      },
      home: Builder(
        builder: (innerContext) {
          return Scaffold(
            backgroundColor: palette.background,
            body: SafeArea(
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 412),
                  child: Stack(
                    children: [
                      Positioned.fill(
                        child: AnimatedSwitcher(
                          duration: const Duration(milliseconds: 260),
                          switchInCurve: const Cubic(0.22, 1.0, 0.36, 1.0),
                          switchOutCurve: Curves.easeIn,
                          transitionBuilder: (child, anim) {
                            return FadeTransition(
                              opacity: anim,
                              child: SlideTransition(
                                position: Tween<Offset>(
                                  begin: const Offset(0, 0.015),
                                  end: Offset.zero,
                                ).animate(anim),
                                child: child,
                              ),
                            );
                          },
                          child: _selectedCardForManage != null
                              ? ManageCardScreen(
                                  key: ValueKey(
                                    'screen-manage-${_selectedCardForManage!.id}',
                                  ),
                                  card: _selectedCardForManage!,
                                  transactions: _transactions,
                                  onBack: () => setState(
                                    () => _selectedCardForManage = null,
                                  ),
                                  isDarkMode: _isDarkMode,
                                )
                              : _activeTab == ScreenId.cards
                                  ? CardsScreen(
                                      key: const ValueKey('screen-cards'),
                                      cards: _cards,
                                      onOpenNewCardModal: () =>
                                          showIssueCardDialog(
                                        context: innerContext,
                                        isDarkMode: _isDarkMode,
                                        onAddCard: _handleAddCard,
                                      ),
                                      onSelectCard: (card) => setState(
                                        () => _selectedCardForManage = card,
                                      ),
                                      isDarkMode: _isDarkMode,
                                    )
                                  : HomeScreen(
                                      key: const ValueKey('screen-home'),
                                      cards: _cards,
                                      transactions: _transactions,
                                      onSelectTransaction: (tx) =>
                                          showTransactionDetailSheet(
                                        context: innerContext,
                                        transaction: tx,
                                        isDarkMode: _isDarkMode,
                                      ),
                                      isDarkMode: _isDarkMode,
                                      onToggleDarkMode: () => setState(
                                        () => _isDarkMode = !_isDarkMode,
                                      ),
                                    ),
                        ),
                      ),

                      // Floating Pill Action Switcher
                      if (_selectedCardForManage == null)
                        Positioned(
                          left: 0,
                          right: 0,
                          bottom: OnyxScale.of(innerContext).s(14),
                          child: Center(
                            child: FloatingPillNav(
                              activeTab: _activeTab,
                              isDarkMode: _isDarkMode,
                              onSelectTab: (tab) => setState(() {
                                _selectedCardForManage = null;
                                _activeTab = tab;
                              }),
                            ),
                          ),
                        ),

                      // Subtle Top Toast Pill
                      if (_statusPillMessage != null)
                        Positioned(
                          top: 8,
                          left: 0,
                          right: 0,
                          child: Center(
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 14,
                                vertical: 6,
                              ),
                              decoration: BoxDecoration(
                                color: const Color(0xFF18181B),
                                borderRadius: BorderRadius.circular(999),
                                border: Border.all(
                                  color: const Color(0xFFD4AF37)
                                      .withValues(alpha: 0.45),
                                ),
                              ),
                              child: Text(
                                _statusPillMessage!,
                                style: OnyxTypography.mono(
                                  fontSize: 10,
                                  color: const Color(0xFFF8F7F4),
                                  letterSpacing: 0.6,
                                ),
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
