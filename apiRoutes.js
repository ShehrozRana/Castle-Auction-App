// API Routes Configuration
const API_BASE_URL = "https://castle-auction-production.up.railway.app/api/";

// 🔐 Authentication APIs
const login = "auth/";
const signup = "users/signup";
const sendCode = "users/send-code";
const verifyOtpRegistration = "users/verify-otp/registration";
const forgotPassword = "users/forget-password";
const verifyOtpForgotPassword = "users/verify-otp/forget-password";
const updatePassword = "users/update-password";
const changePassword = "users/change-password";
const getUser = "users/me";
const updateUser = "users/update-user";
const deleteUser = "users/";

// 🏛️ Auction APIs
const getAuctions = "auction/all/"; // GET /auction/all/{page}
const getAuctionDetail = "auction/details/"; // GET /auction/details/{auctionId}
const getLotDetail = "lot/details/"; // GET /lot/details/{lotId}
const likeAuction = "auction/like/"; // POST /auction/like/{auctionId}
const getFavoriteAuctions = "auction/fav/me/"; // GET /auction/fav/me/{page}
const createAuctionRegistration = "auction/registration/"; // POST /auction/registration/{auctionId}
const getMyRegistrations = "auction/me/registration"; // GET /auction/me/registration
const editAuctionRegistration = "auction/edit-registration/"; // PUT /auction/edit-registration/{auctionId}

// 📁 Category APIs
const getAllCategories = "cat/all"; // GET /cat/all
const getSubcategories = "subcat/all"; // GET /subcat/all?category={categoryId}

// 👤 User Profile APIs
const updateUserProfile = "users/update-user";

// 📝 Orders & Invoices
const getCustomerOrders = "auction/customer/order/"; // GET /auction/customer/order/:id
const getOrderDetails = "auction/order/details"; // GET /auction/order/details
const getCustomerInvoices = "auction/customer/invoices"; // GET /auction/customer/invoices

// 💳 Payment APIs
const getPaymentKey = "payment/key"; // GET /payment/key
const createPayment = "payment/create"; // POST /payment/create
const paymentHistory = "payment/history";

// 💬 Chat & Messaging
const getAllConversation = "auction/conversations"; // GET /auction/conversations
const getUserMessages = "auction/messages"; // GET /auction/messages
const sendMessage = "msg/send"; // POST /msg/send
const getLiveChat = "msg/liveChat"; // GET /msg/liveChat
const seenMessage = "msg/seen-msg"; // PUT /msg/seen-msg

// 🔔 Notifications
const getNotification = "notification/all"; // GET /notification/all
const markNotificationSeen = "notification/check-seen"; // PUT /notification/check-seen
const deleteNotification = "notification/"; // DELETE /notification/{notificationId}

// 📱 Support & Help
const createSupport = "support/create"; // POST /support/create
const getFAQCategories = "pages/faqcat"; // GET /pages/faqcat
const getFAQs = "pages/faqs"; // GET /pages/faqs
const getFooterInfo = "users/footer"; // GET /users/footer

// 📁 File Upload
const imageUpload = "image/upload"; // POST /image/upload
const videoUpload = "image/video"; // POST /image/video

// 🌍 Localization & Settings
const getCurrencyRates = "users/data"; // GET /users/data
const getPrivacyPolicy = "users/privacy"; // GET /users/privacy
const getTermsConditions = "users/terms"; // GET /users/terms

// 🏦 Bank & Payment Methods
const getBanks = "bank"; // GET /bank

// 🔄 Refund & Wallet
const requestRefund = "deposit/request-refund"; // POST /deposit/request-refund
const addToWallet = "deposit/add-to-wallet"; // POST /deposit/add-to-wallet

// Legacy endpoints (keeping for backward compatibility)
const getAllAuctionUsingPaging = "auction/admin/";
const getUserOrders = "auction/order/user";
const getUserInvoices = "auction/invoice/user";

// Admin endpoints (not used in mobile app)
const addStaff = "users/admin/add-staff";
const getStaffUsers = "users/admin/staff/";
const updateStaffUser = "users/admin/staff-update";
const deleteStaffUser = "users";
const teamLogin = "auth/company/team";
const quote = "quote";
const createCompanyMember = "users/company-admin/add-member";
const editCompanyMember = "users/company-admin/members-update";
const getCompanyMember = "users/company-admin/members";
const getLeadLink = "quote/link";
const createLeads = "lead/create";
const getLeads = "lead/all";
const updateLeads = "lead/update-status";
const updateLeadStatus = "lead/update-status/";
const createLeadProposal = "lead/send-proposal/";
const createLeadDate = "lead/schedule-follow/";
const createClient = "client/create";
const loginClient = "auth/company/client";
const checkClientEmail = "users/client/check-email";
const getAllClients = "client/all/";
const leadSignup = "lead/signup-request";
const checkTeamMemberEmail = "users/member/check-email";
const getClientProposal = "lead/proposal";
const updateClientDetails = "client/update";
const updateClientDetailsByAdmin = "client/edit/";
const getClientDetails = "client/detail/";
const acceptStatusProposal = "lead/accept-proposal/";
const getPackages = "package/all";

// Payment APIs
const paymentCheckout = "payment/checkoutsession";
const compeleteSubscription = "payment/complete-subscription";
const updateSubscription = "payment/updateSubscription";
const cancelSubscription = "payment/cancelSubscription";
const taskCrud = "task/";
const taskComment = "task/comment/";
const saveProposal = "lead/save-proposal";
const editProposalService = "service/";
const getProposalService = "service/current/";
const serviceSaveHistory = "service/save/history/";
const getServiceHistroy = "service/history/";
const documentsCrud = "document/";
const uploadFileApi = "file/upload";
const updatepayinvoice = "payment/payinvoice";

// Team Member APIs
const taskAssign = "teamtask";
const editTask = "teamtask/edit/";
const getTask = "teamtask/";
const updateStatus = "teamtask/update-status/";
const updateComment = "teamtask/comment";
const teamMetrices = "teamtask/dashboard";

// Email Configuration APIs
const emailConfigureCreate = "email-conf/save";
const emailConfigureSend = "email-conf/send";
const emailConfigureGet = "email-conf";
const getCompanies = "users/admin/company";
const changeClientPassword = "client/edit";

// Chat APIs
const chatUserConversation = "users/conversations";

// Payment & Account APIs
const verifyAccount = "payment/verifyAccount";
const createAccountStripe = "payment/createAccount";
const createPaymentStripe = "payment/create";
const companyEditProfile = "users/company-admin/update";
const paymentProposals = "payment/proposal";

// Metrics APIs
const leadMetrices = "lead/dashboard";
const clientMetrices = "lead/client-dashboard";
const askPayment = "payment/request/taxsubmission/amount";
const updatePayment = "payment/updateRequest";
const sendOtherProposal = "lead/send-other-proposal";
const taskMetrices = "teamtask/member/dashboard";

// Privacy & Terms APIs
const getPrivacyPolicyLegacy = "pages/privacy";
const getTerms = "pages/terms";

// Support APIs
const getSupports = "support/admin/";
const attendSupport = "support/attended";

// FAQs APIs
const faqCrud = "pages/faqs";
const faqCatCrud = "pages/faqcat";

// Payment & Subscription APIs
const getCompaniesSubscriptions = "users/company/subscriptions-transactions";
const getSubscriptionCard = "payment/cardDetails";
const paymentAddCard = "payment/add-card";

// Bank APIs
const bankGet = "bank";
const bankPost = "bank/create";
const bankPut = "bank/";
const bankDelete = "bank/";

// Category APIs
const createCat = "cat/create";
const editCat = "cat/edit";
const allCat = "cat/admin-all";
const catStatus = "cat";
const allCatUsingPaging = "cat/admin";
const changeStatusCat = "cat/active";

// Lot APIs
const createNewLot = "lot/create";
const editLot = "lot/edit";
const getAllLots = "lot/admin/";
const getWithoutPagingLot = "lot/admin-all";
const updateLotStatus = "lot";

// Auction APIs
const createNewAuction = "auction/create";
const editAuction = "auction/edit";
const updateAuctionStatus = "auction";
const adminEditAuctionStatus = "auction/admin/edit-registration/";
const auctionStatus = "auction";
const selectAuctionLot = "auction/lot-select";
const editAuctionApplication = "auction/admin/edit-registration";
const deleteAuctionApplication = "applications/admin/delete";
const auctionBidWinners = "auction/admin/winners/";
const orderUpdate = "auction/order/update";
const bidWinnerDetail = "auction/admin/winner-detail";
const auctionRegistrationTracking = "auction/admin/registration/";
const getAuctionRegistration = "auction/admin/registration-detail";
const privacyPages = "users";
const getInvoiceDetail = "auction/order/details";
const sendInvoice = "auction/send-invoice";
const getInvoices = "auction/admin/invoices/";
const editInvoice = "auction/update-invoice";
const updateTransaction = "auction/admin-invoice/update";

// Footer & Dashboard APIs
const footerCrud = "users/footer";
const footerImageUpload = "image/catimage";
const dashboardMetrices = "users/dashboard";
const lotMetrices = "lot/dashboard";
const auctionMetrices = "auction/dasboard";
const paymentInvoicesMetrices = "auction/dasboardPaymentInvoices";
const cashierMetrices = "auction/dashboardCashier";
const clearanceMetrices = "auction/dashboardClearance";
const auctioneerMetrices = "auction/dashboardAuctioneer";

// Support & Email APIs
const getSubscribeEmails = "support/subscribe/admin";
const sendUpdates = "support/sendUpdatesEmail";

// Deposit & Refund APIs
const refundProcess = "admin/deposits/process-refund";
const stripeRefund = "admin/deposits/process-stripe-refund";

// Subcategory APIs
const subCatCreate = "subcat/create";
const allSubCat = "subcat/admin-all";
const getPaginatedSubCat = "subcat/admin";
const editSubCat = "subcat/edit";
const subCatStatusUpdate = "subcat/";

// User Authentication APIs (for our app)
const checkEmail = "users/check-email";
const checkPhone = "users/check-phone";

export {
  API_BASE_URL,
  
  // 🔐 Authentication APIs
  login,
  signup,
  sendCode,
  verifyOtpRegistration,
  forgotPassword,
  verifyOtpForgotPassword,
  updatePassword,
  changePassword,
  getUser,
  updateUser,
  deleteUser,
  
  // 🏛️ Auction APIs
  getAuctions,
  getAuctionDetail,
  getLotDetail,
  likeAuction,
  getFavoriteAuctions,
  createAuctionRegistration,
  getMyRegistrations,
  editAuctionRegistration,
  
  // 📁 Category APIs
  getAllCategories,
  getSubcategories,
  
  // 👤 User Profile APIs
  updateUserProfile,
  
  // 📝 Orders & Invoices
  getCustomerOrders,
  getOrderDetails,
  getCustomerInvoices,
  
  // 💳 Payment APIs
  getPaymentKey,
  createPayment,
  paymentHistory,
  
  // 💬 Chat & Messaging
  getAllConversation,
  getUserMessages,
  sendMessage,
  getLiveChat,
  seenMessage,
  
  // 🔔 Notifications
  getNotification,
  markNotificationSeen,
  deleteNotification,
  
  // 📱 Support & Help
  createSupport,
  getFAQCategories,
  getFAQs,
  getFooterInfo,
  
  // 📁 File Upload
  imageUpload,
  videoUpload,
  
  // 🌍 Localization & Settings
  getCurrencyRates,
  getPrivacyPolicy,
  getTermsConditions,
  
  // 🏦 Bank & Payment Methods
  getBanks,
  
  // 🔄 Refund & Wallet
  requestRefund,
  addToWallet,
  
  // Legacy endpoints
  getAllAuctionUsingPaging,
  getUserOrders,
  getUserInvoices,
  
  // Admin endpoints (not used in mobile app)
  addStaff,
  getStaffUsers,
  updateStaffUser,
  deleteStaffUser,
  teamLogin,
  quote,
  createCompanyMember,
  editCompanyMember,
  getCompanyMember,
  getLeadLink,
  createLeads,
  getLeads,
  updateLeads,
  updateLeadStatus,
  createLeadProposal,
  createLeadDate,
  createClient,
  loginClient,
  checkClientEmail,
  getAllClients,
  leadSignup,
  checkTeamMemberEmail,
  getClientProposal,
  updateClientDetails,
  updateClientDetailsByAdmin,
  getClientDetails,
  acceptStatusProposal,
  getPackages,
  paymentCheckout,
  compeleteSubscription,
  updateSubscription,
  cancelSubscription,
  taskCrud,
  taskComment,
  saveProposal,
  editProposalService,
  getProposalService,
  serviceSaveHistory,
  getServiceHistroy,
  documentsCrud,
  uploadFileApi,
  updatepayinvoice,
  taskAssign,
  editTask,
  getTask,
  updateStatus,
  updateComment,
  teamMetrices,
  emailConfigureCreate,
  emailConfigureSend,
  emailConfigureGet,
  getCompanies,
  changeClientPassword,
  chatUserConversation,
  verifyAccount,
  createAccountStripe,
  createPaymentStripe,
  companyEditProfile,
  paymentProposals,
  leadMetrices,
  clientMetrices,
  askPayment,
  updatePayment,
  sendOtherProposal,
  taskMetrices,
  getPrivacyPolicyLegacy,
  getTerms,
  getSupports,
  attendSupport,
  faqCrud,
  faqCatCrud,
  getCompaniesSubscriptions,
  getSubscriptionCard,
  paymentAddCard,
  bankGet,
  bankPost,
  bankPut,
  bankDelete,
  createCat,
  editCat,
  allCat,
  allCatUsingPaging,
  catStatus,
  changeStatusCat,
  createNewLot,
  editLot,
  getAllLots,
  getWithoutPagingLot,
  updateLotStatus,
  createNewAuction,
  editAuction,
  updateAuctionStatus,
  adminEditAuctionStatus,
  auctionStatus,
  selectAuctionLot,
  editAuctionApplication,
  deleteAuctionApplication,
  auctionBidWinners,
  orderUpdate,
  bidWinnerDetail,
  auctionRegistrationTracking,
  getAuctionRegistration,
  privacyPages,
  getInvoiceDetail,
  sendInvoice,
  getInvoices,
  editInvoice,
  updateTransaction,
  footerCrud,
  footerImageUpload,
  dashboardMetrices,
  lotMetrices,
  auctionMetrices,
  paymentInvoicesMetrices,
  cashierMetrices,
  clearanceMetrices,
  auctioneerMetrices,
  getSubscribeEmails,
  sendUpdates,
  refundProcess,
  stripeRefund,
  subCatCreate,
  allSubCat,
  getPaginatedSubCat,
  editSubCat,
  subCatStatusUpdate,
  checkEmail,
  checkPhone,
}; 