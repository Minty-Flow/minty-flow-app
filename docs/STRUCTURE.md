# Project Structure
Generated on: 2026-06-30T17:44:01.297Z
```
./
├── .github/
├── .husky/
│   ├── _/
│   │   ├── .gitignore
│   │   ├── applypatch-msg
│   │   ├── commit-msg
│   │   ├── h
│   │   ├── husky.sh
│   │   ├── post-applypatch
│   │   ├── post-checkout
│   │   ├── post-commit
│   │   ├── post-merge
│   │   ├── post-rewrite
│   │   ├── pre-applypatch
│   │   ├── pre-auto-gc
│   │   ├── pre-commit
│   │   ├── pre-merge-commit
│   │   ├── pre-push
│   │   ├── pre-rebase
│   │   └── prepare-commit-msg
│   └── pre-commit
├── .vscode/
│   └── settings.json
├── .zed/
│   └── settings.json
├── docs/
│   ├── refund-loans-new-design.md
│   ├── release-notes-format.md
│   └── STRUCTURE.md
├── plugins/
│   └── with-android-release-signing.mts
├── scripts/
│   ├── add-icons.py
│   ├── check-missing-i18n-keys.mts
│   ├── find-unused-styles.mts
│   ├── generate-structure.mts
│   └── trim-icons.py
├── src/
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   └── stats-view.tsx
│   │   ├── accounts/
│   │   │   ├── [accountId]/
│   │   │   │   ├── index.tsx
│   │   │   │   └── modify.tsx
│   │   │   └── index.tsx
│   │   ├── onboarding/
│   │   │   ├── _layout.tsx
│   │   │   ├── accounts.tsx
│   │   │   ├── expense-categories.tsx
│   │   │   ├── income-categories.tsx
│   │   │   ├── index.tsx
│   │   │   └── start.tsx
│   │   ├── settings/
│   │   │   ├── bill-splitter/
│   │   │   │   ├── add-item.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── names.tsx
│   │   │   │   └── summary.tsx
│   │   │   ├── budgets/
│   │   │   │   ├── [budgetId]/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── modify.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── categories/
│   │   │   │   ├── [categoryId]/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── modify.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   └── presets.tsx
│   │   │   ├── data-management/
│   │   │   │   ├── export-history.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── goals/
│   │   │   │   ├── [goalId]/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── modify.tsx
│   │   │   │   ├── archived.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── loans/
│   │   │   │   ├── [loanId]/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── modify.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── preferences/
│   │   │   │   ├── button-placement.tsx
│   │   │   │   ├── exchange-rates.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── language.tsx
│   │   │   │   ├── money-formatting.tsx
│   │   │   │   ├── pending-transactions.tsx
│   │   │   │   ├── privacy.tsx
│   │   │   │   ├── reminder.tsx
│   │   │   │   ├── theme.tsx
│   │   │   │   ├── toast-style.tsx
│   │   │   │   ├── transaction-appearance.tsx
│   │   │   │   ├── transaction-location.tsx
│   │   │   │   ├── transfers.tsx
│   │   │   │   └── trash-bin.tsx
│   │   │   ├── tags/
│   │   │   │   ├── [tagId].tsx
│   │   │   │   └── index.tsx
│   │   │   ├── all-accounts.tsx
│   │   │   ├── edit-profile.tsx
│   │   │   ├── index.tsx
│   │   │   ├── pending-transactions.tsx
│   │   │   └── trash.tsx
│   │   ├── transaction/
│   │   │   └── [id].tsx
│   │   ├── _layout.tsx
│   │   └── +html.tsx
│   ├── assets/
│   │   └── images/
│   │       ├── android-icon-background.png
│   │       ├── android-icon-foreground.png
│   │       ├── android-icon-monochrome.png
│   │       ├── favicon.png
│   │       ├── icon.png
│   │       └── splash-icon.png
│   ├── components/
│   │   ├── accounts/
│   │   │   ├── account-modify/
│   │   │   │   ├── account-delete-section.tsx
│   │   │   │   ├── account-form-footer.tsx
│   │   │   │   ├── account-form-modals.tsx
│   │   │   │   ├── account-modify-content.tsx
│   │   │   │   ├── account-modify.styles.ts
│   │   │   │   ├── account-switches-section.tsx
│   │   │   │   ├── types.ts
│   │   │   │   └── use-account-form.ts
│   │   │   ├── account-card.tsx
│   │   │   └── account-type-inline.tsx
│   │   ├── bill-splitter/
│   │   │   ├── add-name-modal.tsx
│   │   │   └── bill-item-card.tsx
│   │   ├── budgets/
│   │   │   ├── budget-modify/
│   │   │   │   ├── budget-form-footer.tsx
│   │   │   │   ├── budget-form-modals.tsx
│   │   │   │   ├── budget-modify-content.tsx
│   │   │   │   ├── budget-modify.styles.ts
│   │   │   │   └── types.ts
│   │   │   └── budget-card.tsx
│   │   ├── categories/
│   │   │   ├── category-modify/
│   │   │   │   ├── category-form-footer.tsx
│   │   │   │   ├── category-form-modals.tsx
│   │   │   │   ├── category-modify-content.tsx
│   │   │   │   ├── category-modify.styles.ts
│   │   │   │   └── types.ts
│   │   │   ├── category-list.tsx
│   │   │   ├── category-row.tsx
│   │   │   ├── category-screen-content.tsx
│   │   │   └── category-type-inline.tsx
│   │   ├── change-icon-inline/
│   │   │   ├── change-icon-inline.styles.ts
│   │   │   ├── emoji-letter-mode.tsx
│   │   │   ├── icon-selection-modal.tsx
│   │   │   ├── image-mode.tsx
│   │   │   ├── index.tsx
│   │   │   ├── mode-selector-list.tsx
│   │   │   └── types.ts
│   │   ├── currency-account-selector/
│   │   │   ├── currency-account-selector.styles.ts
│   │   │   ├── index.tsx
│   │   │   └── types.ts
│   │   ├── data-management/
│   │   │   └── import-confirm-modal.tsx
│   │   ├── date-range-preset-modal/
│   │   │   ├── date-range-preset-modal-content.tsx
│   │   │   ├── date-range-preset-modal.styles.ts
│   │   │   ├── index.tsx
│   │   │   ├── presets.ts
│   │   │   └── types.ts
│   │   ├── goals/
│   │   │   ├── goal-modify/
│   │   │   │   ├── goal-form-footer.tsx
│   │   │   │   ├── goal-form-modals.tsx
│   │   │   │   ├── goal-modify-content.tsx
│   │   │   │   ├── goal-modify.styles.ts
│   │   │   │   └── types.ts
│   │   │   └── goal-card.tsx
│   │   ├── icons/
│   │   │   ├── filled/
│   │   │   │   ├── Adjustments.tsx
│   │   │   │   ├── Alarm.tsx
│   │   │   │   ├── AlarmMinus.tsx
│   │   │   │   ├── AlarmPlus.tsx
│   │   │   │   ├── AlertCircle.tsx
│   │   │   │   ├── AlertTriangle.tsx
│   │   │   │   ├── Analyze.tsx
│   │   │   │   ├── Apple.tsx
│   │   │   │   ├── Archive.tsx
│   │   │   │   ├── ArrowDownCircle.tsx
│   │   │   │   ├── ArrowUpCircle.tsx
│   │   │   │   ├── Atom2.tsx
│   │   │   │   ├── Award.tsx
│   │   │   │   ├── BabyCarriage.tsx
│   │   │   │   ├── Backspace.tsx
│   │   │   │   ├── BallBowling.tsx
│   │   │   │   ├── Balloon.tsx
│   │   │   │   ├── Bandage.tsx
│   │   │   │   ├── Barbell.tsx
│   │   │   │   ├── Basket.tsx
│   │   │   │   ├── Bath.tsx
│   │   │   │   ├── Bed.tsx
│   │   │   │   ├── BedFlat.tsx
│   │   │   │   ├── Beer.tsx
│   │   │   │   ├── Bell.tsx
│   │   │   │   ├── BellMinus.tsx
│   │   │   │   ├── BellPlus.tsx
│   │   │   │   ├── BellRinging.tsx
│   │   │   │   ├── BellX.tsx
│   │   │   │   ├── Bike.tsx
│   │   │   │   ├── Binoculars.tsx
│   │   │   │   ├── Blender.tsx
│   │   │   │   ├── Bolt.tsx
│   │   │   │   ├── Book.tsx
│   │   │   │   ├── Bookmark.tsx
│   │   │   │   ├── Bookmarks.tsx
│   │   │   │   ├── Bottle.tsx
│   │   │   │   ├── Bowl.tsx
│   │   │   │   ├── BowlChopsticks.tsx
│   │   │   │   ├── BowlSpoon.tsx
│   │   │   │   ├── BrandApple.tsx
│   │   │   │   ├── BrandFacebook.tsx
│   │   │   │   ├── BrandGoogle.tsx
│   │   │   │   ├── BrandInstagram.tsx
│   │   │   │   ├── BrandLinkedin.tsx
│   │   │   │   ├── BrandPaypal.tsx
│   │   │   │   ├── BrandSpotify.tsx
│   │   │   │   ├── BrandStripe.tsx
│   │   │   │   ├── BrandTwitter.tsx
│   │   │   │   ├── BrandWhatsapp.tsx
│   │   │   │   ├── BrandYoutube.tsx
│   │   │   │   ├── Bread.tsx
│   │   │   │   ├── Briefcase.tsx
│   │   │   │   ├── Briefcase2.tsx
│   │   │   │   ├── BuildingBridge2.tsx
│   │   │   │   ├── Bulb.tsx
│   │   │   │   ├── Bus.tsx
│   │   │   │   ├── Cactus.tsx
│   │   │   │   ├── Calculator.tsx
│   │   │   │   ├── Calendar.tsx
│   │   │   │   ├── CalendarEvent.tsx
│   │   │   │   ├── CalendarMonth.tsx
│   │   │   │   ├── CalendarWeek.tsx
│   │   │   │   ├── Camera.tsx
│   │   │   │   ├── Campfire.tsx
│   │   │   │   ├── Candle.tsx
│   │   │   │   ├── Car.tsx
│   │   │   │   ├── Car4Wd.tsx
│   │   │   │   ├── Caravan.tsx
│   │   │   │   ├── CaretDown.tsx
│   │   │   │   ├── CaretUp.tsx
│   │   │   │   ├── CarSuv.tsx
│   │   │   │   ├── CashBanknote.tsx
│   │   │   │   ├── ChartArea.tsx
│   │   │   │   ├── ChartAreaLine.tsx
│   │   │   │   ├── ChartBubble.tsx
│   │   │   │   ├── ChartCandle.tsx
│   │   │   │   ├── ChartDonut.tsx
│   │   │   │   ├── ChartDots.tsx
│   │   │   │   ├── ChartFunnel.tsx
│   │   │   │   ├── ChartPie.tsx
│   │   │   │   ├── Check.tsx
│   │   │   │   ├── ChefHat.tsx
│   │   │   │   ├── Cherry.tsx
│   │   │   │   ├── ChevronDown.tsx
│   │   │   │   ├── ChevronRight.tsx
│   │   │   │   ├── ChristmasTree.tsx
│   │   │   │   ├── Circle.tsx
│   │   │   │   ├── CircleDot.tsx
│   │   │   │   ├── CirclePlus.tsx
│   │   │   │   ├── Circles.tsx
│   │   │   │   ├── Clipboard.tsx
│   │   │   │   ├── Clock.tsx
│   │   │   │   ├── ClockHour4.tsx
│   │   │   │   ├── Cloud.tsx
│   │   │   │   ├── CloudComputing.tsx
│   │   │   │   ├── Coin.tsx
│   │   │   │   ├── CoinBitcoin.tsx
│   │   │   │   ├── CoinEuro.tsx
│   │   │   │   ├── CoinPound.tsx
│   │   │   │   ├── CoinRupee.tsx
│   │   │   │   ├── CoinYen.tsx
│   │   │   │   ├── CoinYuan.tsx
│   │   │   │   ├── Compass.tsx
│   │   │   │   ├── Confetti.tsx
│   │   │   │   ├── Cookie.tsx
│   │   │   │   ├── Copy.tsx
│   │   │   │   ├── CreditCard.tsx
│   │   │   │   ├── Crown.tsx
│   │   │   │   ├── CurrentLocation.tsx
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Database.tsx
│   │   │   │   ├── DeviceDesktop.tsx
│   │   │   │   ├── DeviceGamepad.tsx
│   │   │   │   ├── DeviceHeartMonitor.tsx
│   │   │   │   ├── DeviceMobile.tsx
│   │   │   │   ├── DeviceSpeaker.tsx
│   │   │   │   ├── DeviceTablet.tsx
│   │   │   │   ├── DeviceTv.tsx
│   │   │   │   ├── DeviceWatch.tsx
│   │   │   │   ├── Dialpad.tsx
│   │   │   │   ├── Diamond.tsx
│   │   │   │   ├── Discount.tsx
│   │   │   │   ├── Download.tsx
│   │   │   │   ├── Droplet.tsx
│   │   │   │   ├── Dumpling.tsx
│   │   │   │   ├── Egg.tsx
│   │   │   │   ├── EggFried.tsx
│   │   │   │   ├── Elevator.tsx
│   │   │   │   ├── Exchange.tsx
│   │   │   │   ├── ExternalLink.tsx
│   │   │   │   ├── Eye.tsx
│   │   │   │   ├── FaceMask.tsx
│   │   │   │   ├── Ferry.tsx
│   │   │   │   ├── File.tsx
│   │   │   │   ├── FileAnalytics.tsx
│   │   │   │   ├── FileDescription.tsx
│   │   │   │   ├── FileDollar.tsx
│   │   │   │   ├── FileInvoice.tsx
│   │   │   │   ├── Files.tsx
│   │   │   │   ├── FileText.tsx
│   │   │   │   ├── Filter.tsx
│   │   │   │   ├── Flag.tsx
│   │   │   │   ├── Flag2.tsx
│   │   │   │   ├── Flame.tsx
│   │   │   │   ├── Flask.tsx
│   │   │   │   ├── Flower.tsx
│   │   │   │   ├── GardenCart.tsx
│   │   │   │   ├── GasStation.tsx
│   │   │   │   ├── Gift.tsx
│   │   │   │   ├── GiftCard.tsx
│   │   │   │   ├── Glass.tsx
│   │   │   │   ├── GlassFull.tsx
│   │   │   │   ├── Globe.tsx
│   │   │   │   ├── Golf.tsx
│   │   │   │   ├── Graph.tsx
│   │   │   │   ├── Hanger2.tsx
│   │   │   │   ├── Headphones.tsx
│   │   │   │   ├── Headset.tsx
│   │   │   │   ├── Heart.tsx
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Home2.tsx
│   │   │   │   ├── HospitalCircle.tsx
│   │   │   │   ├── Hourglass.tsx
│   │   │   │   ├── Id.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── InfoCircle.tsx
│   │   │   │   ├── Key.tsx
│   │   │   │   ├── Keyboard.tsx
│   │   │   │   ├── Leaf.tsx
│   │   │   │   ├── Library.tsx
│   │   │   │   ├── LibraryPlus.tsx
│   │   │   │   ├── Lifebuoy.tsx
│   │   │   │   ├── Link.tsx
│   │   │   │   ├── ListDetails.tsx
│   │   │   │   ├── Lock.tsx
│   │   │   │   ├── Lungs.tsx
│   │   │   │   ├── Magnet.tsx
│   │   │   │   ├── Mail.tsx
│   │   │   │   ├── MailOpened.tsx
│   │   │   │   ├── Man.tsx
│   │   │   │   ├── MapPin.tsx
│   │   │   │   ├── MedicalCross.tsx
│   │   │   │   ├── Melon.tsx
│   │   │   │   ├── Message.tsx
│   │   │   │   ├── Message2.tsx
│   │   │   │   ├── MessageChatbot.tsx
│   │   │   │   ├── MessageCircle.tsx
│   │   │   │   ├── MessageReport.tsx
│   │   │   │   ├── Messages.tsx
│   │   │   │   ├── Microphone.tsx
│   │   │   │   ├── Microscope.tsx
│   │   │   │   ├── Microwave.tsx
│   │   │   │   ├── Milk.tsx
│   │   │   │   ├── MoodHappy.tsx
│   │   │   │   ├── Moon.tsx
│   │   │   │   ├── Motorbike.tsx
│   │   │   │   ├── Mountain.tsx
│   │   │   │   ├── Mug.tsx
│   │   │   │   ├── Mushroom.tsx
│   │   │   │   ├── Navigation.tsx
│   │   │   │   ├── Nurse.tsx
│   │   │   │   ├── Paint.tsx
│   │   │   │   ├── Palette.tsx
│   │   │   │   ├── Paw.tsx
│   │   │   │   ├── Pencil.tsx
│   │   │   │   ├── Pennant.tsx
│   │   │   │   ├── Pennant2.tsx
│   │   │   │   ├── Phone.tsx
│   │   │   │   ├── PhoneCall.tsx
│   │   │   │   ├── Photo.tsx
│   │   │   │   ├── Pig.tsx
│   │   │   │   ├── Pill.tsx
│   │   │   │   ├── Pin.tsx
│   │   │   │   ├── Pinned.tsx
│   │   │   │   ├── Pizza.tsx
│   │   │   │   ├── Plane.tsx
│   │   │   │   ├── PlaneArrival.tsx
│   │   │   │   ├── PlaneDeparture.tsx
│   │   │   │   ├── PlayerPause.tsx
│   │   │   │   ├── PlayerPlay.tsx
│   │   │   │   ├── Playlist.tsx
│   │   │   │   ├── Plus.tsx
│   │   │   │   ├── Presentation.tsx
│   │   │   │   ├── PresentationAnalytics.tsx
│   │   │   │   ├── Puzzle.tsx
│   │   │   │   ├── Quote.tsx
│   │   │   │   ├── ReceiptDollar.tsx
│   │   │   │   ├── ReceiptEuro.tsx
│   │   │   │   ├── ReceiptPound.tsx
│   │   │   │   ├── ReceiptRupee.tsx
│   │   │   │   ├── ReceiptYen.tsx
│   │   │   │   ├── ReceiptYuan.tsx
│   │   │   │   ├── ReportAnalytics.tsx
│   │   │   │   ├── ReportMoney.tsx
│   │   │   │   ├── Rosette.tsx
│   │   │   │   ├── RosetteDiscount.tsx
│   │   │   │   ├── RosetteDiscountCheck.tsx
│   │   │   │   ├── Salad.tsx
│   │   │   │   ├── Satellite.tsx
│   │   │   │   ├── School.tsx
│   │   │   │   ├── Seedling.tsx
│   │   │   │   ├── Send.tsx
│   │   │   │   ├── Settings.tsx
│   │   │   │   ├── Shield.tsx
│   │   │   │   ├── ShieldCheck.tsx
│   │   │   │   ├── ShieldLock.tsx
│   │   │   │   ├── Shirt.tsx
│   │   │   │   ├── ShoppingCart.tsx
│   │   │   │   ├── Soup.tsx
│   │   │   │   ├── Sparkles.tsx
│   │   │   │   ├── Sparkles2.tsx
│   │   │   │   ├── Speedboat.tsx
│   │   │   │   ├── SquareAsterisk.tsx
│   │   │   │   ├── Stack.tsx
│   │   │   │   ├── Star.tsx
│   │   │   │   ├── SteeringWheel.tsx
│   │   │   │   ├── Sun.tsx
│   │   │   │   ├── Sunglasses.tsx
│   │   │   │   ├── Sunrise.tsx
│   │   │   │   ├── Sunset.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── Tag.tsx
│   │   │   │   ├── Tags.tsx
│   │   │   │   ├── ThumbDown.tsx
│   │   │   │   ├── ThumbUp.tsx
│   │   │   │   ├── Ticket.tsx
│   │   │   │   ├── TimelineEvent.tsx
│   │   │   │   ├── ToolsKitchen2.tsx
│   │   │   │   ├── Train.tsx
│   │   │   │   ├── Trash.tsx
│   │   │   │   ├── Triangle.tsx
│   │   │   │   ├── Trolley.tsx
│   │   │   │   ├── Trophy.tsx
│   │   │   │   ├── Truck.tsx
│   │   │   │   ├── Umbrella.tsx
│   │   │   │   ├── User.tsx
│   │   │   │   ├── Video.tsx
│   │   │   │   ├── Woman.tsx
│   │   │   │   ├── World.tsx
│   │   │   │   ├── Writing.tsx
│   │   │   │   ├── WritingSign.tsx
│   │   │   │   └── ZoomMoney.tsx
│   │   │   └── outline/
│   │   │       ├── Activity.tsx
│   │   │       ├── AddressBook.tsx
│   │   │       ├── Affiliate.tsx
│   │   │       ├── AlertSquareRounded.tsx
│   │   │       ├── Anchor.tsx
│   │   │       ├── Archive.tsx
│   │   │       ├── ArchiveOff.tsx
│   │   │       ├── ArrowDown.tsx
│   │   │       ├── ArrowDownCircle.tsx
│   │   │       ├── ArrowDownLeft.tsx
│   │   │       ├── ArrowNarrowDown.tsx
│   │   │       ├── ArrowNarrowLeft.tsx
│   │   │       ├── ArrowNarrowRight.tsx
│   │   │       ├── ArrowNarrowUp.tsx
│   │   │       ├── ArrowsDiff.tsx
│   │   │       ├── ArrowsMoveVertical.tsx
│   │   │       ├── ArrowsRightLeft.tsx
│   │   │       ├── ArrowsTransferUpDown.tsx
│   │   │       ├── ArrowsUpDown.tsx
│   │   │       ├── ArrowUp.tsx
│   │   │       ├── ArrowUpCircle.tsx
│   │   │       ├── ArrowUpRight.tsx
│   │   │       ├── Asterisk.tsx
│   │   │       ├── Basket.tsx
│   │   │       ├── Bell.tsx
│   │   │       ├── Building.tsx
│   │   │       ├── BuildingBank.tsx
│   │   │       ├── Calendar.tsx
│   │   │       ├── CalendarRepeat.tsx
│   │   │       ├── Camera.tsx
│   │   │       ├── CaretDown.tsx
│   │   │       ├── CaretUp.tsx
│   │   │       ├── CashBanknote.tsx
│   │   │       ├── CashBanknotePlus.tsx
│   │   │       ├── Category.tsx
│   │   │       ├── Category2.tsx
│   │   │       ├── CategoryPlus.tsx
│   │   │       ├── ChartBar.tsx
│   │   │       ├── ChartHistogram.tsx
│   │   │       ├── ChartPie.tsx
│   │   │       ├── Check.tsx
│   │   │       ├── Checks.tsx
│   │   │       ├── ChevronDown.tsx
│   │   │       ├── ChevronLeft.tsx
│   │   │       ├── ChevronRight.tsx
│   │   │       ├── ChevronsDown.tsx
│   │   │       ├── ChevronsUp.tsx
│   │   │       ├── ChevronUp.tsx
│   │   │       ├── Circle.tsx
│   │   │       ├── CircleDot.tsx
│   │   │       ├── Circles.tsx
│   │   │       ├── Clipboard.tsx
│   │   │       ├── Clock.tsx
│   │   │       ├── ClockBolt.tsx
│   │   │       ├── Coffee.tsx
│   │   │       ├── Coins.tsx
│   │   │       ├── ColorSwatch.tsx
│   │   │       ├── Copy.tsx
│   │   │       ├── CreditCard.tsx
│   │   │       ├── Currency.tsx
│   │   │       ├── CurrencyDollar.tsx
│   │   │       ├── Database.tsx
│   │   │       ├── DatabaseExport.tsx
│   │   │       ├── DatabaseImport.tsx
│   │   │       ├── DeviceMobileOff.tsx
│   │   │       ├── DeviceMobileVibration.tsx
│   │   │       ├── Dice.tsx
│   │   │       ├── Divide.tsx
│   │   │       ├── Download.tsx
│   │   │       ├── Equal.tsx
│   │   │       ├── Eraser.tsx
│   │   │       ├── EyeOff.tsx
│   │   │       ├── File.tsx
│   │   │       ├── Files.tsx
│   │   │       ├── FileTypeCsv.tsx
│   │   │       ├── FileTypeJpg.tsx
│   │   │       ├── FileTypePdf.tsx
│   │   │       ├── FileX.tsx
│   │   │       ├── FileZip.tsx
│   │   │       ├── Filter2.tsx
│   │   │       ├── Filter2Search.tsx
│   │   │       ├── Filter2X.tsx
│   │   │       ├── FilterOff.tsx
│   │   │       ├── Fingerprint.tsx
│   │   │       ├── Graph.tsx
│   │   │       ├── GripHorizontal.tsx
│   │   │       ├── Hash.tsx
│   │   │       ├── HeartHandshake.tsx
│   │   │       ├── HistoryToggle.tsx
│   │   │       ├── HomeShare.tsx
│   │   │       ├── index.ts
│   │   │       ├── InfoCircle.tsx
│   │   │       ├── Language.tsx
│   │   │       ├── LibraryPhoto.tsx
│   │   │       ├── ListDetails.tsx
│   │   │       ├── Lock.tsx
│   │   │       ├── LockOpen.tsx
│   │   │       ├── Map.tsx
│   │   │       ├── MapPin.tsx
│   │   │       ├── MathSymbols.tsx
│   │   │       ├── Minus.tsx
│   │   │       ├── MoonStars.tsx
│   │   │       ├── PageBreak.tsx
│   │   │       ├── Paperclip.tsx
│   │   │       ├── PasswordMobilePhone.tsx
│   │   │       ├── Paw.tsx
│   │   │       ├── Pencil.tsx
│   │   │       ├── Percentage.tsx
│   │   │       ├── Photo.tsx
│   │   │       ├── PigMoney.tsx
│   │   │       ├── Plant.tsx
│   │   │       ├── PlaylistX.tsx
│   │   │       ├── Plug.tsx
│   │   │       ├── Plus.tsx
│   │   │       ├── PlusMinus.tsx
│   │   │       ├── Puzzle.tsx
│   │   │       ├── QuestionMark.tsx
│   │   │       ├── Receipt.tsx
│   │   │       ├── ReceiptRefund.tsx
│   │   │       ├── Refresh.tsx
│   │   │       ├── Repeat.tsx
│   │   │       ├── Restore.tsx
│   │   │       ├── Scale.tsx
│   │   │       ├── Search.tsx
│   │   │       ├── Settings.tsx
│   │   │       ├── Share.tsx
│   │   │       ├── ShieldCheckered.tsx
│   │   │       ├── ShieldExclamation.tsx
│   │   │       ├── Snowflake.tsx
│   │   │       ├── Square.tsx
│   │   │       ├── SquareCheck.tsx
│   │   │       ├── Star.tsx
│   │   │       ├── SwitchHorizontal.tsx
│   │   │       ├── Tag.tsx
│   │   │       ├── TagPlus.tsx
│   │   │       ├── Tags.tsx
│   │   │       ├── Target.tsx
│   │   │       ├── Transfer.tsx
│   │   │       ├── Trash.tsx
│   │   │       ├── TrashOff.tsx
│   │   │       ├── TrendingDown.tsx
│   │   │       ├── TrendingUp.tsx
│   │   │       ├── User.tsx
│   │   │       ├── UserPlus.tsx
│   │   │       ├── UserQuestion.tsx
│   │   │       ├── Users.tsx
│   │   │       ├── Video.tsx
│   │   │       ├── Wallet.tsx
│   │   │       ├── Wand.tsx
│   │   │       ├── WorldMap.tsx
│   │   │       ├── WorldPin.tsx
│   │   │       └── X.tsx
│   │   ├── inline-category-picker/
│   │   │   └── index.tsx
│   │   ├── loans/
│   │   │   ├── loan-modify/
│   │   │   │   ├── loan-form-footer.tsx
│   │   │   │   ├── loan-form-modals.tsx
│   │   │   │   ├── loan-modify-content.tsx
│   │   │   │   ├── loan-modify.styles.ts
│   │   │   │   └── types.ts
│   │   │   ├── loan-action-modal.tsx
│   │   │   └── loan-card.tsx
│   │   ├── location/
│   │   │   └── form-location-picker.tsx
│   │   ├── profile/
│   │   │   └── profile-section.tsx
│   │   ├── selector-modals/
│   │   │   ├── contact-selector-modal.tsx
│   │   │   ├── currency-selector-modal.tsx
│   │   │   └── styles.ts
│   │   ├── smart-amount-input/
│   │   │   ├── amount-input-row.tsx
│   │   │   ├── amount-label-row.tsx
│   │   │   ├── amount-preview-chip.tsx
│   │   │   ├── index.tsx
│   │   │   ├── math-toolbar.tsx
│   │   │   ├── math-utils.ts
│   │   │   └── styles.ts
│   │   ├── stats/
│   │   │   ├── balance-timeline-chart.tsx
│   │   │   ├── chart-container.tsx
│   │   │   ├── chart-crosshair.tsx
│   │   │   ├── currency-hero-row.tsx
│   │   │   ├── currency-stat-section.tsx
│   │   │   ├── daily-expense-line-chart.tsx
│   │   │   ├── delta-badge.tsx
│   │   │   ├── stat-hero-card.tsx
│   │   │   ├── stats-averages-row.tsx
│   │   │   ├── stats-category-pie.tsx
│   │   │   ├── stats-empty-state.tsx
│   │   │   ├── stats-pending-notice.tsx
│   │   │   └── stats-skeleton.tsx
│   │   ├── tag/
│   │   │   ├── action-buttons.tsx
│   │   │   ├── delete-section.tsx
│   │   │   ├── form-tag-fields.tsx
│   │   │   ├── form-tag-modals.tsx
│   │   │   └── type-tabs.tsx
│   │   ├── tags/
│   │   │   └── tag-card.tsx
│   │   ├── theme/
│   │   │   ├── standalone-themes-section.tsx
│   │   │   ├── theme-category-segmented-control.tsx
│   │   │   ├── theme-color-grid.tsx
│   │   │   ├── theme-header.tsx
│   │   │   ├── theme-variant-pills.tsx
│   │   │   └── theme.styles.ts
│   │   ├── transaction/
│   │   │   ├── transaction-filter-header/
│   │   │   │   ├── panels/
│   │   │   │   │   ├── accounts-panel.tsx
│   │   │   │   │   ├── attachments-panel.tsx
│   │   │   │   │   ├── categories-panel.tsx
│   │   │   │   │   ├── currency-panel.tsx
│   │   │   │   │   ├── group-by-panel.tsx
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── pending-panel.tsx
│   │   │   │   │   ├── search-panel.tsx
│   │   │   │   │   ├── tags-panel.tsx
│   │   │   │   │   └── type-panel.tsx
│   │   │   │   ├── filter-header.styles.ts
│   │   │   │   ├── index.tsx
│   │   │   │   ├── panel-clear-button.tsx
│   │   │   │   ├── panel-done-button.tsx
│   │   │   │   ├── types.ts
│   │   │   │   └── utils.ts
│   │   │   ├── transaction-form-v3/
│   │   │   │   ├── constants.ts
│   │   │   │   ├── form-account-picker.tsx
│   │   │   │   ├── form-attachments-section.tsx
│   │   │   │   ├── form-budget-picker.tsx
│   │   │   │   ├── form-category-picker.tsx
│   │   │   │   ├── form-conversion-section.tsx
│   │   │   │   ├── form-date-section.tsx
│   │   │   │   ├── form-delete-actions.tsx
│   │   │   │   ├── form-footer.tsx
│   │   │   │   ├── form-goal-picker.tsx
│   │   │   │   ├── form-loan-picker.tsx
│   │   │   │   ├── form-modals.tsx
│   │   │   │   ├── form-notes-section.tsx
│   │   │   │   ├── form-recurring-section.tsx
│   │   │   │   ├── form-tags-picker.tsx
│   │   │   │   ├── form-to-account-picker.tsx
│   │   │   │   ├── form-utils.ts
│   │   │   │   ├── form.styles.ts
│   │   │   │   ├── index.tsx
│   │   │   │   ├── types.ts
│   │   │   │   ├── use-form-attachments.ts
│   │   │   │   ├── use-form-conversion-rate.ts
│   │   │   │   ├── use-form-date-picker.tsx
│   │   │   │   └── use-form-location.ts
│   │   │   ├── transaction-item/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── left-action.tsx
│   │   │   │   ├── right-action.tsx
│   │   │   │   ├── styles.ts
│   │   │   │   ├── transaction-item-left.tsx
│   │   │   │   └── transaction-item-right.tsx
│   │   │   ├── upcoming-transactions-section/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── types.ts
│   │   │   │   ├── upcoming-transactions-section.styles.ts
│   │   │   │   ├── use-app-foreground.ts
│   │   │   │   └── utils.ts
│   │   │   ├── attachment-preview-modal.tsx
│   │   │   ├── delete-recurring-modal.tsx
│   │   │   ├── edit-recurring-modal.tsx
│   │   │   ├── location-picker-modal.tsx
│   │   │   ├── notes-modal.tsx
│   │   │   ├── transaction-section-list.tsx
│   │   │   └── transaction-type-selector.tsx
│   │   ├── ui/
│   │   │   ├── date-time-picker/
│   │   │   │   ├── date-time-picker-modal.tsx
│   │   │   │   ├── date-time-picker.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── styles.ts
│   │   │   │   └── use-date-time-picker.tsx
│   │   │   ├── switch/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── switch.android.tsx
│   │   │   │   └── switch.ios.tsx
│   │   │   ├── activity-indicator-minty.tsx
│   │   │   ├── button.tsx
│   │   │   ├── chevron-icon.tsx
│   │   │   ├── chips.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── icon-svg.tsx
│   │   │   ├── info-banner.tsx
│   │   │   ├── input.tsx
│   │   │   ├── permission-banner.tsx
│   │   │   ├── pressable.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── text.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── view.tsx
│   │   ├── action-item.tsx
│   │   ├── app-lock-gate.tsx
│   │   ├── color-variant-inline.tsx
│   │   ├── confirm-modal.tsx
│   │   ├── dynamic-icon.tsx
│   │   ├── external-link.tsx
│   │   ├── info-modal.tsx
│   │   ├── keyboard-sticky-view-minty.tsx
│   │   ├── money.tsx
│   │   ├── month-year-picker.tsx
│   │   ├── preset-list-item.tsx
│   │   ├── privacy-eye-control.tsx
│   │   ├── reorderable-list-v2.tsx
│   │   ├── search-input.tsx
│   │   ├── summary-card.tsx
│   │   ├── tabs-minty.tsx
│   │   └── toggle-item.tsx
│   ├── constants/
│   │   ├── app-data.ts
│   │   ├── fab-button.ts
│   │   ├── minty-icons-selection.ts
│   │   ├── pre-sets-accounts.ts
│   │   └── pre-sets-categories.ts
│   ├── contexts/
│   │   ├── pager-scroll-control.tsx
│   │   └── scroll-into-view-context.tsx
│   ├── database/
│   │   ├── mappers/
│   │   │   ├── account.mapper.ts
│   │   │   ├── budget.mapper.ts
│   │   │   ├── category.mapper.ts
│   │   │   ├── goal.mapper.ts
│   │   │   ├── hydrateTransactions.ts
│   │   │   ├── loan.mapper.ts
│   │   │   ├── tag.mapper.ts
│   │   │   └── transaction.mapper.ts
│   │   ├── migrations/
│   │   │   ├── sqlite-runner.ts
│   │   │   ├── sqlite-v1.ts
│   │   │   └── sqlite-v2.ts
│   │   ├── repos/
│   │   │   ├── account-repo.ts
│   │   │   ├── budget-repo.ts
│   │   │   ├── category-repo.ts
│   │   │   ├── goal-repo.ts
│   │   │   ├── loan-repo.ts
│   │   │   ├── tag-repo.ts
│   │   │   ├── transaction-repo.ts
│   │   │   └── transaction-tag-repo.ts
│   │   ├── services-sqlite/
│   │   │   ├── account-service.ts
│   │   │   ├── balance-service.ts
│   │   │   ├── budget-service.ts
│   │   │   ├── category-service.ts
│   │   │   ├── data-management-service.ts
│   │   │   ├── goal-service.ts
│   │   │   ├── loan-service.ts
│   │   │   ├── recurring-transaction-service.ts
│   │   │   ├── stats-service.ts
│   │   │   ├── tag-service.ts
│   │   │   ├── transaction-service.ts
│   │   │   └── transfer-service.ts
│   │   ├── types/
│   │   │   └── rows.ts
│   │   ├── utils/
│   │   │   ├── generate-id.ts
│   │   │   ├── get-balance-delta.ts
│   │   │   └── import-snapshot.ts
│   │   ├── db.ts
│   │   ├── events.ts
│   │   ├── instrumentation.ts
│   │   ├── sql.ts
│   │   ├── transaction.ts
│   │   └── write-queue.ts
│   ├── hooks/
│   │   ├── exchange-rates-editor.reducer.ts
│   │   ├── use-balance-before.ts
│   │   ├── use-boot-hydration.ts
│   │   ├── use-chart-font.ts
│   │   ├── use-import-recovery.ts
│   │   ├── use-location-permission-status.ts
│   │   ├── use-navigation-guard.ts
│   │   ├── use-notification-permission-status.ts
│   │   ├── use-notification-sync.ts
│   │   ├── use-recurring-rule.ts
│   │   ├── use-recurring-transaction-sync.ts
│   │   ├── use-retention-cleanup.ts
│   │   ├── use-scroll-into-view.ts
│   │   ├── use-shake-listener.ts
│   │   ├── use-stats.ts
│   │   └── use-time-reactivity.ts
│   ├── i18n/
│   │   ├── translation/
│   │   │   ├── ar.json
│   │   │   └── en.json
│   │   ├── config.ts
│   │   └── language.constants.ts
│   ├── schemas/
│   │   ├── accounts.schema.ts
│   │   ├── budgets.schema.ts
│   │   ├── categories.schema.ts
│   │   ├── goals.schema.ts
│   │   ├── loans.schema.ts
│   │   ├── tags.schema.ts
│   │   └── transactions.schema.ts
│   ├── services/
│   │   ├── auto-confirmation-service.ts
│   │   ├── currency-registry.ts
│   │   ├── exchange-rates.ts
│   │   └── pending-transaction-notifications.ts
│   ├── stores/
│   │   ├── db/
│   │   │   ├── account.store.ts
│   │   │   ├── budget.store.ts
│   │   │   ├── category.store.ts
│   │   │   ├── goal.store.ts
│   │   │   ├── loan.store.ts
│   │   │   ├── tag.store.ts
│   │   │   └── transaction.store.ts
│   │   ├── android-sound.store.ts
│   │   ├── app-lock.store.ts
│   │   ├── bill-splitter.store.ts
│   │   ├── button-placement.store.ts
│   │   ├── exchange-rates-preferences.store.ts
│   │   ├── export-history.store.ts
│   │   ├── language.store.ts
│   │   ├── money-formatting.store.ts
│   │   ├── notification.store.ts
│   │   ├── onboarding.store.ts
│   │   ├── pending-transactions.store.ts
│   │   ├── profile.store.ts
│   │   ├── theme.store.ts
│   │   ├── toast-style.store.ts
│   │   ├── toast.store.ts
│   │   ├── transaction-item-appearance.store.ts
│   │   ├── transaction-location.store.ts
│   │   ├── transfers-preferences.store.ts
│   │   ├── trash-bin.store.ts
│   │   └── upcoming-section.store.ts
│   ├── styles/
│   │   ├── theme/
│   │   │   ├── schemes/
│   │   │   │   ├── catppuccin.ts
│   │   │   │   ├── minty.ts
│   │   │   │   └── standalone.ts
│   │   │   ├── base.ts
│   │   │   ├── colors.ts
│   │   │   ├── factory.ts
│   │   │   ├── registry.ts
│   │   │   ├── types.ts
│   │   │   ├── typography.ts
│   │   │   ├── unistyles-themes.ts
│   │   │   └── utils.ts
│   │   ├── breakpoints.ts
│   │   ├── fonts.ts
│   │   └── unistyles.ts
│   ├── types/
│   │   ├── accounts.ts
│   │   ├── bill-splitter.ts
│   │   ├── budgets.ts
│   │   ├── categories.ts
│   │   ├── currency.ts
│   │   ├── goals.ts
│   │   ├── loans.ts
│   │   ├── new.ts
│   │   ├── stats.ts
│   │   ├── tags.ts
│   │   ├── transaction-filters.ts
│   │   └── transactions.ts
│   └── utils/
│       ├── account-types-list.ts
│       ├── file-icon.ts
│       ├── format-file-size.ts
│       ├── get-week-start-on.ts
│       ├── is-image-url.ts
│       ├── is-single-emoji-or-letter.ts
│       ├── logger.ts
│       ├── number-format.ts
│       ├── open-file.ts
│       ├── parse-math-expression.ts
│       ├── pending-transactions.ts
│       ├── recurrence.ts
│       ├── stats-date-range.ts
│       ├── string-utils.ts
│       ├── theme-utils.ts
│       ├── time-utils.ts
│       ├── toast.ts
│       └── transaction-list-utils.ts
├── .env.local
├── .env.local.example
├── .gitignore
├── .nvmrc
├── .svgrrc
├── app.json
├── babel.config.js
├── biome.json
├── expo-env.d.ts
├── index.ts
├── LICENSE
├── metro.config.js
├── minty-flow-upload.keystore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
└── tsconfig.json

```
