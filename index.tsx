/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

const CURRENCIES = [
    { code: "USD", name: "US Dollar" }, { code: "EUR", name: "Euro" }, { code: "JPY", name: "Japanese Yen" }, { code: "GBP", name: "British Pound" }, { code: "AUD", name: "Australian Dollar" }, { code: "CAD", name: "Canadian Dollar" }, { code: "CHF", name: "Swiss Franc" }, { code: "CNY", name: "Chinese Yuan" }, { code: "SEK", name: "Swedish Krona" }, { code: "NZD", name: "New Zealand Dollar" }, { code: "MXN", name: "Mexican Peso" }, { code: "SGD", name: "Singapore Dollar" }, { code: "HKD", name: "Hong Kong Dollar" }, { code: "NOK", name: "Norwegian Krone" }, { code: "KRW", name: "South Korean Won" }, { code: "TRY", name: "Turkish Lira" }, { code: "RUB", name: "Russian Ruble" }, { code: "INR", name: "Indian Rupee" }, { code: "BRL", name: "Brazilian Real" }, { code: "ZAR", name: "South African Rand" }, { code: "AFN", name: "Afghan Afghani" }, { code: "ALL", name: "Albanian Lek" }, { code: "DZD", name: "Algerian Dinar" }, { code: "AOA", name: "Angolan Kwanza" }, { code: "ARS", name: "Argentine Peso" }, { code: "AMD", name: "Armenian Dram" }, { code: "AWG", name: "Aruban Florin" }, { code: "AZN", name: "Azerbaijani Manat" }, { code: "BSD", name: "Bahamian Dollar" }, { code: "BHD", name: "Bahraini Dinar" }, { code: "BDT", name: "Bangladeshi Taka" }, { code: "BBD", name: "Barbadian Dollar" }, { code: "BYN", name: "Belarusian Ruble" }, { code: "BZD", name: "Belize Dollar" }, { code: "BMD", name: "Bermudan Dollar" }, { code: "BTN", name: "Bhutanese Ngultrum" }, { code: "BOB", name: "Bolivian Boliviano" }, { code: "BAM", name: "Bosnia-Herzegovina Convertible Mark" }, { code: "BWP", name: "Botswanan Pula" }, { code: "BGN", name: "Bulgarian Lev" }, { code: "BIF", name: "Burundian Franc" }, { code: "KHR", name: "Cambodian Riel" }, { code: "CVE", name: "Cape Verdean Escudo" }, { code: "KYD", name: "Cayman Islands Dollar" }, { code: "XOF", name: "CFA Franc BCEAO" }, { code: "XAF", name: "CFA Franc BEAC" }, { code: "XPF", name: "CFP Franc" }, { code: "CLP", name: "Chilean Peso" }, { code: "COP", name: "Colombian Peso" }, { code: "KMF", name: "Comorian Franc" }, { code: "CDF", name: "Congolese Franc" }, { code: "CRC", name: "Costa Rican Colón" }, { code: "HRK", name: "Croatian Kuna" }, { code: "CUP", name: "Cuban Peso" }, { code: "CZK", name: "Czech Koruna" }, { code: "DKK", name: "Danish Krone" }, { code: "DJF", name: "Djiboutian Franc" }, { code: "DOP", name: "Dominican Peso" }, { code: "XCD", name: "East Caribbean Dollar" }, { code: "EGP", name: "Egyptian Pound" }, { code: "ERN", name: "Eritrean Nakfa" }, { code: "ETB", name: "Ethiopian Birr" }, { code: "FKP", name: "Falkland Islands Pound" }, { code: "FJD", name: "Fijian Dollar" }, { code: "GMD", name: "Gambian Dalasi" }, { code: "GEL", name: "Georgian Lari" }, { code: "GHS", name: "Ghanaian Cedi" }, { code: "GIP", name: "Gibraltar Pound" }, { code: "GTQ", name: "Guatemalan Quetzal" }, { code: "GNF", name: "Guinean Franc" }, { code: "GYD", name: "Guyanaese Dollar" }, { code: "HTG", name: "Haitian Gourde" }, { code: "HNL", name: "Honduran Lempira" }, { code: "HUF", name: "Hungarian Forint" }, { code: "ISK", name: "Icelandic Króna" }, { code: "IDR", name: "Indonesian Rupiah" }, { code: "IRR", name: "Iranian Rial" }, { code: "IQD", name: "Iraqi Dinar" }, { code: "ILS", name: "Israeli New Shekel" }, { code: "JMD", name: "Jamaican Dollar" }, { code: "JOD", name: "Jordanian Dinar" }, { code: "KZT", name: "Kazakhstani Tenge" }, { code: "KES", name: "Kenyan Shilling" }, { code: "KWD", name: "Kuwaiti Dinar" }, { code: "KGS", name: "Kyrgystani Som" }, { code: "LAK", name: "Laotian Kip" }, { code: "LBP", name: "Lebanese Pound" }, { code: "LSL", name: "Lesotho Loti" }, { code: "LRD", name: "Liberian Dollar" }, { code: "LYD", name: "Libyan Dinar" }, { code: "MOP", name: "Macanese Pataca" }, { code: "MKD", name: "Macedonian Denar" }, { code: "MGA", name: "Malagasy Ariary" }, { code: "MWK", name: "Malawian Kwacha" }, { code: "MYR", name: "Malaysian Ringgit" }, { code: "MVR", name: "Maldivian Rufiyaa" }, { code: "MRU", name: "Mauritanian Ouguiya" }, { code: "MUR", name: "Mauritian Rupee" }, { code: "MDL", name: "Moldovan Leu" }, { code: "MNT", name: "Mongolian Tugrik" }, { code: "MAD", name: "Moroccan Dirham" }, { code: "MZN", name: "Mozambican Metical" }, { code: "MMK", name: "Myanma Kyat" }, { code: "NAD", name: "Namibian Dollar" }, { code: "NPR", name: "Nepalese Rupee" }, { code: "TWD", name: "New Taiwan Dollar" }, { code: "NIO", name: "Nicaraguan Córdoba" }, { code: "NGN", name: "Nigerian Naira" }, { code: "OMR", name: "Omani Rial" }, { code: "PKR", name: "Pakistani Rupee" }, { code: "PAB", name: "Panamanian Balboa" }, { code: "PGK", name: "Papua New Guinean Kina" }, { code: "PYG", name: "Paraguayan Guarani" }, { code: "PEN", name: "Peruvian Nuevo Sol" }, { code: "PHP", name: "Philippine Peso" }, { code: "PLN", name: "Polish Zloty" }, { code: "QAR", name: "Qatari Rial" }, { code: "RON", name: "Romanian Leu" }, { code: "RWF", name: "Rwandan Franc" }, { code: "SHP", name: "Saint Helena Pound" }, { code: "WST", name: "Samoan Tala" }, { code: "STN", name: "São Tomé and Príncipe Dobra" }, { code: "SAR", name: "Saudi Riyal" }, { code: "RSD", name: "Serbian Dinar" }, { code: "SCR", name: "Seychellois Rupee" }, { code: "SLL", name: "Sierra Leonean Leone" }, { code: "SBD", name: "Solomon Islands Dollar" }, { code: "SOS", name: "Somali Shilling" }, { code: "SSP", name: "South Sudanese Pound" }, { code: "LKR", name: "Sri Lankan Rupee" }, { code: "SDG", name: "Sudanese Pound" }, { code: "SRD", name: "Surinamese Dollar" }, { code: "SZL", name: "Swazi Lilangeni" }, { code: "SYP", name: "Syrian Pound" }, { code: "TJS", name: "Tajikistani Somoni" }, { code: "TZS", name: "Tanzanian Shilling" }, { code: "THB", name: "Thai Baht" }, { code: "TOP", name: "Tongan Pa'anga" }, { code: "TTD", name: "Trinidad and Tobago Dollar" }, { code: "TND", name: "Tunisian Dinar" }, { code: "TMT", name: "Turkmenistani Manat" }, { code: "UGX", name: "Ugandan Shilling" }, { code: "UAH", name: "Ukrainian Hryvnia" }, { code: "AED", name: "United Arab Emirates Dirham" }, { code: "UYU", name: "Uruguayan Peso" }, { code: "UZS", name: "Uzbekistan Som" }, { code: "VUV", name: "Vanuatu Vatu" }, { code: "VES", name: "Venezuelan Bolívar" }, { code: "VND", name: "Vietnamese Dong" }, { code: "YER", name: "Yemeni Rial" }, { code: "ZMW", name: "Zambian Kwacha" }
];

const E_WALLET_PROVIDERS = [
  "Alipay", "Apple Pay", "Cash App", "Chipper Cash", "GoPay", "Google Pay", "GrabPay", "Klarna", "LINE Pay", "M-Pesa", "Mercado Pago", "MobilePay", "Neteller", "Payoneer", "PayPal", "Paytm", "PhonePe", "PicPay", "Rakuten Pay", "Revolut", "Samsung Pay", "Skrill", "Swish", "Venmo", "WeChat Pay", "Wise", "Zelle", "Other"
];

const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ar', name: 'العربية', dir: 'rtl' },
    { code: 'zh', name: '中文' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'ja', name: '日本語' },
];

const translations = {
    // English
    en: {
        // Titles
        titleAuth: "Create Your Account",
        titleVerifyEmail: "Verify Your Email",
        titleVerifyPhone: "Verify Your Phone",
        titleSetupProfile: "Set Up Your Profile",
        titleDonate: "Make a Donation",
        titleSuccess: "Thank You!",
        // General
        tagline: "Inspired by generosity. Your support makes a difference.",
        createAccount: "Create an account",
        ageNotice: "For users aged 13 and above.",
        continueWithGoogle: "Continue with Google",
        continueWithApple: "Continue with Apple",
        continueWithFacebook: "Continue with Facebook",
        or: "OR",
        email: "Email",
        phone: "Phone",
        emailAddress: "Email Address",
        phoneNumber: "Phone Number",
        continue: "Continue",
        goBack: "Go Back",
        // Verification
        checkYourEmail: "Check your email",
        verificationSent: "We've sent a verification link to",
        verifiedEmail: "I've Verified My Email",
        resendEmail: "Resend Email",
        verifyYourPhone: "Verify your phone",
        otpSent: "We've sent a 6-digit code to",
        enterOtp: "Enter 6-Digit Code",
        verify: "Verify",
        resendOtp: "Resend OTP",
        // Profile
        setupProfile: "Set Up Your Profile",
        profileInfo: "This information will be displayed with your donations.",
        uploadPicture: "Upload Picture",
        fullName: "Full Name",
        username: "Username",
        completeSetup: "Complete Setup",
        // Donation
        thankYou: "Thank You!",
        donationAppreciated: "Your generous donation is greatly appreciated.",
        anotherDonation: "Make Another Donation",
        currency: "Currency",
        amount: "Amount",
        custom: "Custom",
        bankAccount: "Bank Account",
        eWallet: "E-Wallet",
        qrCode: "QR Code",
        scanToDonate: "Scan with your payment app to donate.",
        simulateScanAndPay: "Simulate Scan & Pay",
        accountHolder: "Account Holder Name",
        iban: "IBAN",
        bicSwift: "BIC / Swift Code",
        provider: "Provider",
        accountId: "Account ID or Phone Number",
        donate: "Donate",
        // Errors
        invalidEmail: "Please enter a valid email address.",
        invalidOtp: "Invalid code. Please try again.",
        usernameTooShort: "Username must be at least 5 characters.",
        usernameInvalid: "Username can only contain letters, numbers, and underscores.",
        usernameTaken: "This username is already taken.",
    },
    // Spanish
    es: {
        titleAuth: "Crear tu cuenta",
        titleVerifyEmail: "Verificar tu correo",
        titleVerifyPhone: "Verificar tu teléfono",
        titleSetupProfile: "Configurar tu perfil",
        titleDonate: "Hacer una donación",
        titleSuccess: "¡Gracias!",
        tagline: "Inspirado por la generosidad. Tu apoyo marca la diferencia.",
        createAccount: "Crear una cuenta",
        ageNotice: "Para usuarios de 13 años o más.",
        continueWithGoogle: "Continuar con Google",
        continueWithApple: "Continuar con Apple",
        continueWithFacebook: "Continuar con Facebook",
        or: "O",
        email: "Correo",
        phone: "Teléfono",
        emailAddress: "Dirección de correo electrónico",
        phoneNumber: "Número de teléfono",
        continue: "Continuar",
        goBack: "Volver",
        checkYourEmail: "Revisa tu correo electrónico",
        verificationSent: "Hemos enviado un enlace de verificación a",
        verifiedEmail: "He verificado mi correo",
        resendEmail: "Reenviar correo",
        verifyYourPhone: "Verifica tu teléfono",
        otpSent: "Hemos enviado un código de 6 dígitos a",
        enterOtp: "Ingresa el código de 6 dígitos",
        verify: "Verificar",
        resendOtp: "Reenviar OTP",
        setupProfile: "Configura tu perfil",
        profileInfo: "Esta información se mostrará con tus donaciones.",
        uploadPicture: "Subir foto",
        fullName: "Nombre completo",
        username: "Nombre de usuario",
        completeSetup: "Completar configuración",
        thankYou: "¡Gracias!",
        donationAppreciated: "Agradecemos enormemente tu generosa donación.",
        anotherDonation: "Hacer otra donación",
        currency: "Moneda",
        amount: "Cantidad",
        custom: "Personalizado",
        bankAccount: "Cuenta bancaria",
        eWallet: "Monedero electrónico",
        qrCode: "Código QR",
        scanToDonate: "Escanea con tu aplicación de pago para donar.",
        simulateScanAndPay: "Simular escaneo y pago",
        accountHolder: "Nombre del titular",
        iban: "IBAN",
        bicSwift: "Código BIC / Swift",
        provider: "Proveedor",
        accountId: "ID de cuenta o teléfono",
        donate: "Donar",
        invalidEmail: "Por favor, introduce una dirección de correo válida.",
        invalidOtp: "Código inválido. Inténtalo de nuevo.",
        usernameTooShort: "El nombre de usuario debe tener al menos 5 caracteres.",
        usernameInvalid: "El nombre de usuario solo puede contener letras, números y guiones bajos.",
        usernameTaken: "Este nombre de usuario ya está en uso.",
    },
    // Add other languages here following the same structure...
    fr: {
        titleAuth: "Créez votre compte",
        titleVerifyEmail: "Vérifiez votre e-mail",
        titleVerifyPhone: "Vérifiez votre téléphone",
        titleSetupProfile: "Configurez votre profil",
        titleDonate: "Faire un don",
        titleSuccess: "Merci !",
        tagline: "Inspiré par la générosité. Votre soutien fait la différence.",
        createAccount: "Créer un compte",
        ageNotice: "Pour les utilisateurs de 13 ans et plus.",
        continueWithGoogle: "Continuer avec Google",
        continueWithApple: "Continuer avec Apple",
        continueWithFacebook: "Continuer avec Facebook",
        or: "OU",
        email: "E-mail",
        phone: "Téléphone",
        emailAddress: "Adresse e-mail",
        phoneNumber: "Numéro de téléphone",
        continue: "Continuer",
        goBack: "Retour",
        checkYourEmail: "Vérifiez votre e-mail",
        verificationSent: "Nous avons envoyé un lien de vérification à",
        verifiedEmail: "J'ai vérifié mon e-mail",
        resendEmail: "Renvoyer l'e-mail",
        verifyYourPhone: "Vérifiez votre téléphone",
        otpSent: "Nous avons envoyé un code à 6 chiffres à",
        enterOtp: "Entrez le code à 6 chiffres",
        verify: "Vérifier",
        resendOtp: "Renvoyer l'OTP",
        setupProfile: "Configurez votre profil",
        profileInfo: "Ces informations seront affichées avec vos dons.",
        uploadPicture: "Télécharger une photo",
        fullName: "Nom complet",
        username: "Nom d'utilisateur",
        completeSetup: "Terminer la configuration",
        thankYou: "Merci !",
        donationAppreciated: "Votre don généreux est très apprécié.",
        anotherDonation: "Faire un autre don",
        currency: "Devise",
        amount: "Montant",
        custom: "Personnalisé",
        bankAccount: "Compte bancaire",
        eWallet: "Portefeuille électronique",
        qrCode: "Code QR",
        scanToDonate: "Scannez avec votre application de paiement pour donner.",
        simulateScanAndPay: "Simuler le scan et le paiement",
        accountHolder: "Nom du titulaire du compte",
        iban: "IBAN",
        bicSwift: "Code BIC / Swift",
        provider: "Fournisseur",
        accountId: "ID de compte ou numéro de téléphone",
        donate: "Donner",
        invalidEmail: "Veuillez saisir une adresse e-mail valide.",
        invalidOtp: "Code invalide. Veuillez réessayer.",
        usernameTooShort: "Le nom d'utilisateur doit comporter au moins 5 caractères.",
        usernameInvalid: "Le nom d'utilisateur ne peut contenir que des lettres, des chiffres et des traits de soulignement.",
        usernameTaken: "Ce nom d'utilisateur est déjà pris.",
    },
    de: {
        titleAuth: "Konto erstellen",
        titleVerifyEmail: "E-Mail bestätigen",
        titleVerifyPhone: "Telefonnummer bestätigen",
        titleSetupProfile: "Profil einrichten",
        titleDonate: "Spenden",
        titleSuccess: "Vielen Dank!",
        tagline: "Inspiriert von Großzügigkeit. Ihre Unterstützung macht einen Unterschied.",
        createAccount: "Konto erstellen",
        ageNotice: "Für Benutzer ab 13 Jahren.",
        continueWithGoogle: "Mit Google fortfahren",
        continueWithApple: "Mit Apple fortfahren",
        continueWithFacebook: "Mit Facebook fortfahren",
        or: "ODER",
        email: "E-Mail",
        phone: "Telefon",
        emailAddress: "E-Mail-Adresse",
        phoneNumber: "Telefonnummer",
        continue: "Weiter",
        goBack: "Zurück",
        checkYourEmail: "Überprüfen Sie Ihre E-Mails",
        verificationSent: "Wir haben einen Bestätigungslink an gesendet",
        verifiedEmail: "Ich habe meine E-Mail bestätigt",
        resendEmail: "E-Mail erneut senden",
        verifyYourPhone: "Bestätigen Sie Ihre Telefonnummer",
        otpSent: "Wir haben einen 6-stelligen Code an gesendet",
        enterOtp: "6-stelligen Code eingeben",
        verify: "Bestätigen",
        resendOtp: "OTP erneut senden",
        setupProfile: "Richten Sie Ihr Profil ein",
        profileInfo: "Diese Informationen werden bei Ihren Spenden angezeigt.",
        uploadPicture: "Bild hochladen",
        fullName: "Vollständiger Name",
        username: "Benutzername",
        completeSetup: "Einrichtung abschließen",
        thankYou: "Vielen Dank!",
        donationAppreciated: "Ihre großzügige Spende wird sehr geschätzt.",
        anotherDonation: "Erneut spenden",
        currency: "Währung",
        amount: "Betrag",
        custom: "Andere",
        bankAccount: "Bankkonto",
        eWallet: "E-Wallet",
        qrCode: "QR-Code",
        scanToDonate: "Scannen Sie mit Ihrer Bezahl-App, um zu spenden.",
        simulateScanAndPay: "Scannen & Bezahlen simulieren",
        accountHolder: "Name des Kontoinhabers",
        iban: "IBAN",
        bicSwift: "BIC / Swift-Code",
        provider: "Anbieter",
        accountId: "Konto-ID oder Telefonnummer",
        donate: "Spenden",
        invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        invalidOtp: "Ungültiger Code. Bitte versuchen Sie es erneut.",
        usernameTooShort: "Der Benutzername muss mindestens 5 Zeichen lang sein.",
        usernameInvalid: "Der Benutzername darf nur Buchstaben, Zahlen und Unterstriche enthalten.",
        usernameTaken: "Dieser Benutzername ist bereits vergeben.",
    },
    ar: {
        titleAuth: "أنشئ حسابك",
        titleVerifyEmail: "تحقق من بريدك الإلكتروني",
        titleVerifyPhone: "تحقق من هاتفك",
        titleSetupProfile: "إعداد ملفك الشخصي",
        titleDonate: "تبرع الآن",
        titleSuccess: "شكرًا لك!",
        tagline: "مستوحى من الكرم. دعمك يحدث فرقًا.",
        createAccount: "أنشئ حسابًا",
        ageNotice: "للمستخدمين بعمر 13 عامًا فما فوق.",
        continueWithGoogle: "متابعة باستخدام جوجل",
        continueWithApple: "متابعة باستخدام آبل",
        continueWithFacebook: "متابعة باستخدام فيسبوك",
        or: "أو",
        email: "البريد الإلكتروني",
        phone: "الهاتف",
        emailAddress: "عنوان البريد الإلكتروني",
        phoneNumber: "رقم الهاتف",
        continue: "متابعة",
        goBack: "رجوع",
        checkYourEmail: "تحقق من بريدك الإلكتروني",
        verificationSent: "لقد أرسلنا رابط تحقق إلى",
        verifiedEmail: "لقد تحققت من بريدي الإلكتروني",
        resendEmail: "إعادة إرسال البريد",
        verifyYourPhone: "تحقق من هاتفك",
        otpSent: "لقد أرسلنا رمزًا مكونًا من 6 أرقام إلى",
        enterOtp: "أدخل الرمز المكون من 6 أرقام",
        verify: "تحقق",
        resendOtp: "إعادة إرسال الرمز",
        setupProfile: "إعداد ملفك الشخصي",
        profileInfo: "سيتم عرض هذه المعلومات مع تبرعاتك.",
        uploadPicture: "تحميل صورة",
        fullName: "الاسم الكامل",
        username: "اسم المستخدم",
        completeSetup: "إكمال الإعداد",
        thankYou: "شكرًا لك!",
        donationAppreciated: "نقدر تبرعك السخي.",
        anotherDonation: "تبرع مرة أخرى",
        currency: "العملة",
        amount: "المبلغ",
        custom: "مخصص",
        bankAccount: "حساب بنكي",
        eWallet: "محفظة إلكترونية",
        qrCode: "رمز الاستجابة السريعة",
        scanToDonate: "امسح الرمز باستخدام تطبيق الدفع الخاص بك للتبرع.",
        simulateScanAndPay: "محاكاة المسح والدفع",
        accountHolder: "اسم صاحب الحساب",
        iban: "IBAN",
        bicSwift: "رمز BIC / Swift",
        provider: "المزود",
        accountId: "معرف الحساب أو رقم الهاتف",
        donate: "تبرع",
        invalidEmail: "الرجاء إدخال عنوان بريد إلكتروني صالح.",
        invalidOtp: "رمز غير صالح. حاول مرة أخرى.",
        usernameTooShort: "يجب أن يتكون اسم المستخدم من 5 أحرف على الأقل.",
        usernameInvalid: "يمكن أن يحتوي اسم المستخدم على أحرف وأرقام وشرطات سفلية فقط.",
        usernameTaken: "اسم المستخدم هذا مأخوذ بالفعل.",
    }
};


const App = () => {
  const state = {
    // FIX: Changed view names from kebab-case to camelCase to avoid syntax errors.
    view: 'auth', // 'auth', 'verifyEmail', 'verifyPhone', 'setupProfile', 'donate', 'success'
    theme: 'light',
    language: 'en',
    isLanguageDropdownOpen: false,
    
    // Donation state
    amount: '',
    currency: 'USD',
    paymentMethod: 'bank', // 'bank', 'ewallet', 'qr'
    isProcessing: false,
    form: {
      bank: { name: '', iban: '', bic: '' },
      ewallet: { provider: E_WALLET_PROVIDERS[0], accountId: '' }
    },

    // Auth state
    auth: {
      method: 'email', // 'email' or 'phone'
      email: '',
      phone: '',
      otp: '',
      fullName: '',
      username: '',
      emailError: '',
      otpError: '',
      usernameError: '',
      resendEmailCooldown: 0,
      resendOtpCooldown: 0,
      emailTimerId: null as ReturnType<typeof setInterval> | null,
      otpTimerId: null as ReturnType<typeof setInterval> | null,
    },
  };

  const root = document.getElementById('root');
  if (!root) return;
  
  const t = (key: keyof typeof translations['en']) => {
    const lang = state.language as keyof typeof translations;
    return translations[lang]?.[key] || translations['en'][key];
  };

  const render = () => {
    const activeElement = document.activeElement as HTMLElement;
    const activeElementId = activeElement?.id;
    let selectionStart: number | null = null;
    let selectionEnd: number | null = null;
    if (activeElement && 'selectionStart' in activeElement && activeElement.selectionStart !== null) {
        selectionStart = (activeElement as HTMLInputElement).selectionStart;
        selectionEnd = (activeElement as HTMLInputElement).selectionEnd;
    }

    root.innerHTML = ''; // Clear previous content
    
    // Set dynamic page title
    // FIX: Changed view names from kebab-case to camelCase.
    switch (state.view) {
        case 'auth': document.title = `dadonate - ${t('titleAuth')}`; break;
        case 'verifyEmail': document.title = `dadonate - ${t('titleVerifyEmail')}`; break;
        case 'verifyPhone': document.title = `dadonate - ${t('titleVerifyPhone')}`; break;
        case 'setupProfile': document.title = `dadonate - ${t('titleSetupProfile')}`; break;
        case 'donate': document.title = `dadonate - ${t('titleDonate')}`; break;
        case 'success': document.title = `dadonate - ${t('titleSuccess')}`; break;
        default: document.title = 'dadonate';
    }

    const currentLang = LANGUAGES.find(l => l.code === state.language) || LANGUAGES[0];
    
    // Page Header
    const pageHeader = document.createElement('header');
    pageHeader.className = 'page-header';
    pageHeader.innerHTML = `
      <div>
        <h1>dadonate</h1>
        <p>${t('tagline')}</p>
      </div>
      <div class="header-controls">
        <div class="language-selector-wrapper">
            <button id="language-select-btn" class="language-selector-btn" aria-haspopup="true" aria-expanded="${state.isLanguageDropdownOpen}" aria-label="Select language">
                <span>${currentLang.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
            </button>
            <ul id="language-dropdown" class="language-dropdown ${state.isLanguageDropdownOpen ? 'open' : ''}" role="menu">
                ${LANGUAGES.map(lang => `<li role="menuitem"><button class="lang-option-btn" data-lang="${lang.code}">${lang.name}</button></li>`).join('')}
            </ul>
        </div>
        <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
           ${state.theme === 'light'
              ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"></path></svg>`
              : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"></path></svg>`
          }
        </button>
      </div>
    `;

    const mainContainer = document.createElement('main');
    mainContainer.className = 'container';

    // FIX: Changed view names from kebab-case to camelCase.
    if (state.view === 'auth') renderAuthView(mainContainer);
    else if (state.view === 'verifyEmail') renderVerifyEmailView(mainContainer);
    else if (state.view === 'verifyPhone') renderVerifyPhoneView(mainContainer);
    else if (state.view === 'setupProfile') renderProfileSetupView(mainContainer);
    else if (state.view === 'donate' || state.view === 'success') renderDonateView(mainContainer);
    
    root.append(pageHeader, mainContainer);
    
    if (activeElementId) {
        const newActiveElement = document.getElementById(activeElementId);
        if (newActiveElement) {
            newActiveElement.focus();
            if (selectionStart !== null && selectionEnd !== null && 'setSelectionRange' in newActiveElement) {
                (newActiveElement as HTMLInputElement).setSelectionRange(selectionStart, selectionEnd);
            }
        }
    }
    
    addEventListeners();
  };

  const addEventListeners = () => {
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    });

    const langBtn = document.getElementById('language-select-btn');
    const langDropdown = document.getElementById('language-dropdown');
    langBtn?.addEventListener('click', () => {
        state.isLanguageDropdownOpen = !state.isLanguageDropdownOpen;
        render();
    });

    document.addEventListener('click', (e) => {
        if (!langBtn?.contains(e.target as Node) && !langDropdown?.contains(e.target as Node)) {
            if (state.isLanguageDropdownOpen) {
                state.isLanguageDropdownOpen = false;
                render();
            }
        }
    });

    document.querySelectorAll('.lang-option-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const newLang = (e.currentTarget as HTMLButtonElement).dataset.lang;
            if (newLang) {
                state.isLanguageDropdownOpen = false;
                setLanguage(newLang);
            }
        });
    });

    // Event listeners for the current view are added within each render function
    const currentViewFunction = `add${state.view.charAt(0).toUpperCase() + state.view.slice(1)}EventListeners`;
    // FIX: Corrected the viewHandlers object to use valid property names, which resolves a major syntax error.
    const viewHandlers: { [key: string]: () => void } = {
        addAuthEventListeners,
        addVerifyEmailEventListeners,
        addVerifyPhoneEventListeners,
        addSetupProfileEventListeners,
        addDonateEventListeners,
        addSuccessEventListeners: addDonateEventListeners,
    };
    if (viewHandlers[currentViewFunction]) viewHandlers[currentViewFunction]();
  }

  const startCooldown = (type: 'email' | 'otp') => {
    if (type === 'email') {
        state.auth.resendEmailCooldown = 30;
        if (state.auth.emailTimerId) clearInterval(state.auth.emailTimerId);
        state.auth.emailTimerId = setInterval(() => {
            state.auth.resendEmailCooldown--;
            if (state.auth.resendEmailCooldown <= 0) {
                clearInterval(state.auth.emailTimerId!);
                state.auth.emailTimerId = null;
            }
            render();
        }, 1000);
    } else {
        state.auth.resendOtpCooldown = 30;
        if (state.auth.otpTimerId) clearInterval(state.auth.otpTimerId);
        state.auth.otpTimerId = setInterval(() => {
            state.auth.resendOtpCooldown--;
            if (state.auth.resendOtpCooldown <= 0) {
                clearInterval(state.auth.otpTimerId!);
                state.auth.otpTimerId = null;
            }
            render();
        }, 1000);
    }
  };
  
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateUsername = (username: string) => {
    const takenUsernames = ['admin', 'root', 'user', 'dadonate'];
    if (username.length < 5) return t('usernameTooShort');
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return t('usernameInvalid');
    if (takenUsernames.includes(username.toLowerCase())) return t('usernameTaken');
    return '';
  };

  const renderAuthView = (container: HTMLElement) => {
    const isEmailValid = isValidEmail(state.auth.email) && !state.auth.emailError;
    const isPhoneValid = state.auth.phone.length === 17;
    const authInputValid = (state.auth.method === 'email' && isEmailValid) || (state.auth.method === 'phone' && isPhoneValid);

    container.innerHTML = `
      <div class="card auth-card">
        <div class="card-header">
            <h2>${t('createAccount')}</h2>
            <p>${t('ageNotice')}</p>
        </div>
        <div class="social-login-section">
             <div class="social-buttons">
                <button class="social-button" data-provider="google" aria-label="${t('continueWithGoogle')}"><svg viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.519-3.487-11.187-8.264l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.904,36.213,44,30.606,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg></button>
                <button class="social-button" data-provider="apple" aria-label="${t('continueWithApple')}"><svg viewBox="0 0 24 24"><path d="M17.9,8.7c-1.3-1.6-3.2-2.1-4.9-2.1c-1.8,0-3.8,1-5.1,2.5c-2,2.4-2.5,6.1-1.3,8.5 c1.1,2,3,3.3,5.1,3.4c0.1,0,0.1,0,0.2,0c1.8,0,3.4-1,4.6-2.6c-1.5-0.9-2.4-2.6-2.4-4.5c0-1.8,0.9-3.5,2.4-4.5 c0.1-0.1,0.2-0.1,0.2-0.2C18.6,9.1,18.3,8.9,17.9,8.7z M14,4.2c0.6-0.7,0.9-1.8,0.7-2.7c-0.8,0-1.9,0.5-2.6,1.2 C11.5,3.3,11.2,4.4,11.4,5.3C12.2,5.3,13.3,4.9,14,4.2z"/></svg></button>
                <button class="social-button" data-provider="facebook" aria-label="${t('continueWithFacebook')}"><svg viewBox="0 0 24 24"><path d="M22,12c0-5.52-4.48-10-10-10S2,6.48,2,12c0,4.84,3.44,8.87,8,9.8V15H8v-3h2V9.5C10,7.57,11.57,6,13.5,6H16v3h-2c-.55,0-1,.45-1,1v2h3v3h-3v6.95c5.05-.5,9-4.76,9-9.95Z"/></svg></button>
            </div>
        </div>
        <div class="divider"><span>${t('or')}</span></div>
        <div class="auth-form-section">
            <form id="auth-form">
                <div class="tabs">
                  <div class="tab-buttons">
                    <button type="button" role="tab" aria-selected="${state.auth.method === 'email'}" class="tab-button ${state.auth.method === 'email' ? 'active' : ''}" data-method="email">${t('email')}</button>
                    <button type="button" role="tab" aria-selected="${state.auth.method === 'phone'}" class="tab-button ${state.auth.method === 'phone' ? 'active' : ''}" data-method="phone">${t('phone')}</button>
                  </div>
                </div>
                <div class="form-content">
                  ${state.auth.method === 'email' ? `
                    <div class="form-group ${state.auth.emailError ? 'has-error' : ''}">
                      <label for="auth-email">${t('emailAddress')}</label>
                      <input type="email" id="auth-email" value="${state.auth.email}" required />
                      ${state.auth.emailError ? `<p class="error-message">${state.auth.emailError}</p>` : ''}
                    </div>
                  ` : `
                    <div class="form-group">
                      <label for="auth-phone">${t('phoneNumber')}</label>
                      <input type="tel" id="auth-phone" value="${state.auth.phone}" required />
                    </div>
                  `}
                </div>
                <button type="submit" class="button button-primary" ${!authInputValid ? 'disabled' : ''}>${t('continue')}</button>
            </form>
        </div>
      </div>
    `;
  }
  
  const addAuthEventListeners = () => {
    document.querySelectorAll('.social-button').forEach(button => {
      // FIX: Changed view name from kebab-case to camelCase.
      button.addEventListener('click', () => { state.view = 'setupProfile'; render(); });
    });

    document.querySelector('#auth-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      if(state.auth.method === 'email' && isValidEmail(state.auth.email)) {
          // FIX: Changed view name from kebab-case to camelCase.
          state.view = 'verifyEmail';
          startCooldown('email');
          render();
      } else if (state.auth.method === 'phone' && state.auth.phone.length === 17) {
          // FIX: Changed view name from kebab-case to camelCase.
          state.view = 'verifyPhone';
          startCooldown('otp');
          render();
      }
    });
    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            state.auth.method = (e.currentTarget as HTMLButtonElement).dataset.method || 'email';
            render();
        });
    });

    if (state.auth.method === 'email') {
        const emailInput = document.querySelector('#auth-email') as HTMLInputElement;
        emailInput?.addEventListener('input', e => { 
            state.auth.email = (e.target as HTMLInputElement).value;
            if (state.auth.emailError) state.auth.emailError = '';
            render(); 
        });
        emailInput?.addEventListener('blur', e => {
            const email = (e.target as HTMLInputElement).value;
            if (email && !isValidEmail(email)) {
                state.auth.emailError = t('invalidEmail');
            } else {
                state.auth.emailError = '';
            }
            render();
        });
    } else {
        document.querySelector('#auth-phone')?.addEventListener('input', e => {
            const input = e.target as HTMLInputElement;
            state.auth.phone = formatPhoneNumber(input.value);
            render();
        });
    }
  }

  const renderVerifyEmailView = (container: HTMLElement) => {
    container.innerHTML = `
        <div class="card verification-card">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"></path></svg>
            <h2>${t('checkYourEmail')}</h2>
            <p>${t('verificationSent')}</p>
            <p class="email-display">${state.auth.email}</p>
            <div class="actions">
                <button class="button button-primary" id="verify-proceed">${t('verifiedEmail')}</button>
                <button class="button button-secondary" id="resend-email" ${state.auth.resendEmailCooldown > 0 ? 'disabled' : ''}>
                    ${t('resendEmail')} ${state.auth.resendEmailCooldown > 0 ? `(${state.auth.resendEmailCooldown}s)` : ''}
                </button>
                <button class="button-link" id="go-back">${t('goBack')}</button>
            </div>
        </div>
    `;
  };

  const addVerifyEmailEventListeners = () => {
    // FIX: Changed view name from kebab-case to camelCase.
    document.querySelector('#verify-proceed')?.addEventListener('click', () => { state.view = 'setupProfile'; render(); });
    document.querySelector('#resend-email')?.addEventListener('click', () => {
        if (state.auth.resendEmailCooldown <=0) startCooldown('email');
    });
    document.querySelector('#go-back')?.addEventListener('click', () => { state.view = 'auth'; render(); });
  }
  
  const renderVerifyPhoneView = (container: HTMLElement) => {
    container.innerHTML = `
        <div class="card verification-card">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm-5 20c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-3H9V5h6v13z"></path></svg>
            <h2>${t('verifyYourPhone')}</h2>
            <p>${t('otpSent')}</p>
            <p class="phone-display">${state.auth.phone}</p>
            <form id="otp-form">
                <div class="form-group otp-group ${state.auth.otpError ? 'has-error' : ''}">
                    <label for="otp-input">${t('enterOtp')}</label>
                    <input type="text" id="otp-input" value="${state.auth.otp}" maxlength="6" pattern="[0-9]*" inputmode="numeric" />
                    ${state.auth.otpError ? `<p class="error-message">${state.auth.otpError}</p>` : ''}
                </div>
                <button type="submit" class="button button-primary" ${state.auth.otp.length !== 6 ? 'disabled' : ''}>${t('verify')}</button>
            </form>
            <div class="actions">
                <button class="button button-secondary" id="resend-otp" ${state.auth.resendOtpCooldown > 0 ? 'disabled' : ''}>
                    ${t('resendOtp')} ${state.auth.resendOtpCooldown > 0 ? `(${state.auth.resendOtpCooldown}s)` : ''}
                </button>
                <button class="button-link" id="go-back">${t('goBack')}</button>
            </div>
        </div>
    `;
  };

  const addVerifyPhoneEventListeners = () => {
      document.querySelector('#otp-form')?.addEventListener('submit', (e) => {
          e.preventDefault();
          // Simulate OTP check
          if (state.auth.otp === '123456') {
              // FIX: Changed view name from kebab-case to camelCase.
              state.view = 'setupProfile';
              state.auth.otpError = '';
          } else {
              state.auth.otpError = t('invalidOtp');
          }
          render();
      });
      document.querySelector('#otp-input')?.addEventListener('input', (e) => {
          let value = (e.target as HTMLInputElement).value.replace(/\D/g, '');
          state.auth.otp = value.slice(0, 6);
          if (state.auth.otpError) state.auth.otpError = '';
          render();
      });
      document.querySelector('#resend-otp')?.addEventListener('click', () => {
        if (state.auth.resendOtpCooldown <=0) startCooldown('otp');
      });
      document.querySelector('#go-back')?.addEventListener('click', () => { state.view = 'auth'; render(); });
  }

  const renderProfileSetupView = (container: HTMLElement) => {
      const isProfileFormValid = state.auth.fullName.trim() !== '' && state.auth.username.trim() !== '' && !state.auth.usernameError;
      container.innerHTML = `
        <div class="card profile-setup-card">
            <h2>${t('setupProfile')}</h2>
            <p>${t('profileInfo')}</p>
            <div class="avatar-section">
                <div class="avatar-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
                </div>
                <button class="button-link upload-button">${t('uploadPicture')}</button>
            </div>
            <form id="profile-form" class="profile-form">
                <div class="form-group">
                    <label for="full-name">${t('fullName')}</label>
                    <div class="input-group">
                         <span class="input-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg></span>
                        <input type="text" id="full-name" value="${state.auth.fullName}" required />
                    </div>
                </div>
                <div class="form-group ${state.auth.usernameError ? 'has-error' : ''}">
                    <label for="username">${t('username')}</label>
                    <div class="input-group">
                        <span class="input-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm4 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></span>
                        <input type="text" id="username" value="${state.auth.username}" required />
                    </div>
                    ${state.auth.usernameError ? `<p class="error-message">${state.auth.usernameError}</p>`: ''}
                </div>
                <button type="submit" class="button button-primary" ${!isProfileFormValid ? 'disabled' : ''}>${t('completeSetup')}</button>
            </form>
        </div>
      `;
  }

  const addProfileSetupEventListeners = () => {
      document.querySelector('#full-name')?.addEventListener('input', e => { state.auth.fullName = (e.target as HTMLInputElement).value; render(); });
      document.querySelector('#username')?.addEventListener('input', e => { 
          const username = (e.target as HTMLInputElement).value;
          state.auth.username = username;
          state.auth.usernameError = validateUsername(username);
          render(); 
      });
      document.querySelector('#profile-form')?.addEventListener('submit', (e) => {
          e.preventDefault();
          if (state.auth.fullName.trim() && !validateUsername(state.auth.username)) { 
            state.view = 'donate'; 
            render(); 
          }
      });
  }

  const renderDonateView = (container: HTMLElement) => {
    if (state.view === 'success') {
      container.innerHTML = `
        <div class="card success-card">
          <svg class="success-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
          <h2>${t('thankYou')}</h2>
          <p>${t('donationAppreciated')}</p>
          <button class="button button-primary" id="reset-button">${t('anotherDonation')}</button>
        </div>
      `;
      return;
    }

    const currencySymbol = getCurrencySymbol(state.currency);
    const presetValues = [1, 2, 5, 10, 20, 50, 100];
    const isFormValid = () => {
        if (!state.amount || parseFloat(state.amount) <= 0) return false;
        if (state.paymentMethod === 'bank') {
            const { name, iban, bic } = state.form.bank;
            return name.trim() !== '' && iban.trim() !== '' && bic.trim() !== '';
        }
        if (state.paymentMethod === 'ewallet') {
            return state.form.ewallet.accountId.trim() !== '';
        }
        return state.paymentMethod === 'qr';
    };
    const isValid = isFormValid();

    container.innerHTML = `
      <form id="donation-form">
        <div class="card">
          <section class="amount-section">
            <div class="amount-input-wrapper">
               <div class="form-group currency-group">
                    <label for="currency-select">${t('currency')}</label>
                    <select id="currency-select" required>
                        ${CURRENCIES.map(c => `<option value="${c.code}" ${state.currency === c.code ? 'selected' : ''}>${c.code} - ${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group amount-group">
                    <label for="amount-input">${t('amount')}</label>
                    <input type="number" id="amount-input" value="${state.amount}" min="1" step="any" required placeholder="0.00" />
                </div>
            </div>
            <div class="preset-amounts">
              ${presetValues.map(value => `
                <button type="button" class="preset-button ${Number(state.amount) === value ? 'active' : ''}" data-amount="${value}">
                  ${currencySymbol}${value}
                </button>
              `).join('')}
              <button type="button" class="preset-button" id="custom-amount-btn">${t('custom')}</button>
            </div>
          </section>
          <section class="payment-method-section">
            <div class="tabs">
              <button type="button" role="tab" aria-selected="${state.paymentMethod === 'bank'}" class="tab-button ${state.paymentMethod === 'bank' ? 'active' : ''}" data-method="bank">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 11h-1V9h1v2zm2.5 0h-1V9h1v2zm-5 0h-1V9h1v2zM21 6H3c-.55 0-1 .45-1 1v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-.55-.45-1-1-1zm-1 12H4V8h16v10zM12 2L3 7v1h18V7L12 2z"></path></svg>
                ${t('bankAccount')}
              </button>
              <button type="button" role="tab" aria-selected="${state.paymentMethod === 'ewallet'}" class="tab-button ${state.paymentMethod === 'ewallet' ? 'active' : ''}" data-method="ewallet">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"></path></svg>
                ${t('eWallet')}
              </button>
              <button type="button" role="tab" aria-selected="${state.paymentMethod === 'qr'}" class="tab-button ${state.paymentMethod === 'qr' ? 'active' : ''}" data-method="qr">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm8-12v8h8V3h-8zm6 6h-4V5h4v4zm-6 8h8v-8h-8v8zm2-6h4v4h-4v-4z"></path></svg>
                ${t('qrCode')}
              </button>
            </div>
            <div class="form-content">
              ${state.paymentMethod === 'bank' ? `
                <div class="form-group"><label for="bank-name">${t('accountHolder')}</label><input type="text" id="bank-name" value="${state.form.bank.name}" required /></div>
                <div class="form-group"><label for="bank-iban">${t('iban')}</label><input type="text" id="bank-iban" value="${state.form.bank.iban}" required /></div>
                <div class="form-group"><label for="bank-bic">${t('bicSwift')}</label><input type="text" id="bank-bic" value="${state.form.bank.bic}" required /></div>
              ` : state.paymentMethod === 'ewallet' ? `
                <div class="form-group"><label for="ewallet-provider">${t('provider')}</label><select id="ewallet-provider" required>${E_WALLET_PROVIDERS.map(p => `<option value="${p}" ${state.form.ewallet.provider === p ? 'selected' : ''}>${p}</option>`).join('')}</select></div>
                <div class="form-group"><label for="ewallet-id">${t('accountId')}</label><input type="text" id="ewallet-id" value="${state.form.ewallet.accountId}" required /></div>
              ` : `
                <div class="qr-code-section">
                    <div class="qr-code-placeholder"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm8-12v8h8V3h-8zm6 6h-4V5h4v4zm-6 8h8v-8h-8v8zm2-6h4v4h-4v-4z"></path></svg></div>
                    <p class="qr-instructions">${t('scanToDonate')}</p>
                    <button type="button" id="simulate-scan-btn" class="button button-primary" ${!state.amount || parseFloat(state.amount) <= 0 ? 'disabled' : ''}>
                        ${state.isProcessing ? '<div class="spinner"></div>' : t('simulateScanAndPay')}
                    </button>
                </div>
              `}
            </div>
          </section>
          ${state.paymentMethod !== 'qr' ? `
          <div class="card-footer">
            <button type="submit" class="button button-primary" ${!isValid || state.isProcessing ? 'disabled' : ''}>
              ${state.isProcessing ? '<div class="spinner"></div>' : `${t('donate')} ${formatCurrency(state.amount || 0, state.currency)}`}
            </button>
          </div>
          ` : ''}
        </div>
      </form>
    `;
  }

  const addDonateEventListeners = () => {
    if (state.view === 'success') {
        document.querySelector('#reset-button')?.addEventListener('click', () => {
            state.view = 'donate';
            state.amount = '';
            state.form = { bank: { name: '', iban: '', bic: '' }, ewallet: { provider: E_WALLET_PROVIDERS[0], accountId: '' } };
            render();
        });
        return;
    }
    
    document.querySelector('#currency-select')?.addEventListener('change', (e) => { state.currency = (e.target as HTMLSelectElement).value; render(); });
    document.querySelector('#amount-input')?.addEventListener('input', (e) => { state.amount = (e.target as HTMLInputElement).value; render(); });
    document.querySelectorAll('.preset-button').forEach(button => {
      button.addEventListener('click', (e) => { state.amount = (e.currentTarget as HTMLButtonElement).dataset.amount || ''; render(); });
    });
    document.querySelector('#custom-amount-btn')?.addEventListener('click', () => { document.querySelector<HTMLInputElement>('#amount-input')?.focus(); });
    document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', (e) => { state.paymentMethod = (e.currentTarget as HTMLButtonElement).dataset.method || 'bank'; render(); });
    });
    
    if (state.paymentMethod === 'bank') {
        document.querySelector('#bank-name')?.addEventListener('input', e => { state.form.bank.name = (e.target as HTMLInputElement).value; render(); });
        document.querySelector('#bank-iban')?.addEventListener('input', e => { state.form.bank.iban = (e.target as HTMLInputElement).value; render(); });
        document.querySelector('#bank-bic')?.addEventListener('input', e => { state.form.bank.bic = (e.target as HTMLInputElement).value; render(); });
    } else if (state.paymentMethod === 'ewallet') {
        document.querySelector('#ewallet-provider')?.addEventListener('change', e => { state.form.ewallet.provider = (e.target as HTMLSelectElement).value; render(); });
        document.querySelector('#ewallet-id')?.addEventListener('input', e => { state.form.ewallet.accountId = (e.target as HTMLInputElement).value; render(); });
    }

    const processDonation = () => {
        state.isProcessing = true;
        render();
        setTimeout(() => {
            state.isProcessing = false;
            state.view = 'success';
            render();
        }, 2000);
    };

    document.querySelector('#donation-form')?.addEventListener('submit', (e: Event) => {
        e.preventDefault();
        if ((!state.amount || parseFloat(state.amount) <= 0)) return;
        if (state.paymentMethod !== 'qr') processDonation();
    });
    
    document.querySelector('#simulate-scan-btn')?.addEventListener('click', () => {
        if (state.amount && parseFloat(state.amount) > 0) processDonation();
    });
  }

  const formatPhoneNumber = (value: string): string => {
    if (!value) return '';
    let digits = value.replace(/\D/g, '');
    if (digits.startsWith('1')) { digits = digits.substring(1); }
    digits = digits.slice(0, 10);
    if (digits.length <= 3) return `+1 (${digits}`;
    if (digits.length <= 6) return `+1 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme, true);
  };
  
  const initializeLanguage = () => {
    const savedLang = localStorage.getItem('language');
    const browserLang = navigator.language.split('-')[0];
    const initialLang = savedLang || (LANGUAGES.some(l => l.code === browserLang) ? browserLang : 'en');
    setLanguage(initialLang, true);
  };
  
  const setLanguage = (lang: string, isInitializing = false) => {
    state.language = lang;
    localStorage.setItem('language', lang);
    const langConfig = LANGUAGES.find(l => l.code === lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', langConfig?.dir || 'ltr');
    if (!isInitializing) render();
  };

  const setTheme = (theme: string, isInitializing = false) => {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (!isInitializing) render();
  };

  const formatCurrency = (amount: string | number, currency: string) => {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(amount));
    } catch (e) {
      return `${currency} ${parseFloat(String(amount)).toFixed(2)}`;
    }
  };

  const getCurrencySymbol = (currency: string) => {
      try {
        const parts = new Intl.NumberFormat(undefined, { style: 'currency', currency: currency, currencyDisplay: 'narrowSymbol' }).formatToParts(1);
        return parts.find(part => part.type === 'currency')?.value || currency;
      } catch (e) {
        return currency;
      }
  }

  initializeTheme();
  initializeLanguage();
  render();
};

App();