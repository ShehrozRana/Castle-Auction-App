// API Routes Configuration
const API_BASE_URL = "http://192.168.18.7:8080/api/";

// Authentication & User Management
const login = "auth/";
const addStaff = "users/admin/add-staff";
const getStaffUsers = "users/admin/staff/";
const updateStaffUser = "users/admin/staff-update";
const deleteStaffUser = "users";

const teamLogin = "auth/company/team";
const quote = `quote`;
const imageUpload = `image/upload`;
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
const getUser = "users/me";

// Payment APIs
const paymentCheckout = "payment/checkoutsession";
const paymentKey = "payment/key";
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
const getAllConversation = "auction/conversations";
const getUserMessages = "auction/messages";
const seenMessage = "/seen-msg";
const chatUserConversation = "users/conversations";

// Payment & Account APIs
const verifyAccount = "payment/verifyAccount";
const createAccountStripe = "payment/createAccount";
const createPaymentStripe = "payment/create";
const companyEditProfile = "users/company-admin/update";
const paymentProposals = "payment/proposal";
const paymentHistory = "payment/history";

// Metrics APIs
const leadMetrices = "lead/dashboard";
const clientMetrices = "lead/client-dashboard";
const askPayment = "payment/request/taxsubmission/amount";
const updatePayment = "payment/updateRequest";
const sendOtherProposal = "lead/send-other-proposal";
const taskMetrices = "teamtask/member/dashboard";

// Notification APIs
const getNotification = "notification/all";
const seenNotification = "notification/check-seen";
const deleteNotification = "notification/";

// Privacy & Terms APIs
const getPrivacyPolicy = "pages/privacy";
const getTerms = "pages/terms";

// Support APIs
const createSupport = "support/create";
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
const getAllAuctionUsingPaging = "auction/admin/";
const adminEditAuctionStatus = "auction/admin/edit-registration/";
const auctionStatus = "auction";
const selectAuctionLot = "auction/lot-select";
const getAuctionDetail = "auction/details";
const editAuctionApplication = "auction/admin/edit-registration";
const deleteAuctionApplication = "applications/admin/delete";
const auctionBidWinners = "auction/admin/winners/";
const orderUpdate = "auction/order/update";
const bidWinnerDetail = "auction/admin/winner-detail";
const getLiveChat = "msg/liveChat";
const auctionRegistrationTracking = "auction/admin/registration/";
const createAuctionRegistration = "auction/registration/";
const editAuctionRegistration = "auction/edit-registration";
const getAuctionRegistration = "auction/admin/registration-detail";
const privacyPages = "users";
const getInvoiceDetail = "auction/order/details";
const updateUser = "users/update-user";
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
const addToWallet = "admin/deposits/add-to-wallet";

// Subcategory APIs
const subCatCreate = "subcat/create";
const allSubCat = "subcat/admin-all";
const getPaginatedSubCat = "subcat/admin";
const editSubCat = "subcat/edit";
const subCatStatusUpdate = "subcat/";

// User Authentication APIs (for our app)
const sendCode = "users/send-code";
const verifyOtpRegistration = "users/verify-otp/registration";
const signup = "users/signup";
const forgotPassword = "users/forget-password";
const verifyOtpForgotPassword = "users/verify-otp/forget-password";
const updatePassword = "users/update-password";
const changePassword = "users/change-password";
const checkEmail = "users/check-email";
const checkPhone = "users/check-phone";
const updateUserProfile = "users/update-user";
const deleteUser = "users/";

// User-specific order routes
const getUserOrders = "auction/order/user";
const getUserInvoices = "auction/invoice/user";

export {
  API_BASE_URL,
  // Authentication & User Management
  login,
  addStaff,
  getStaffUsers,
  updateStaffUser,
  deleteStaffUser,
  teamLogin,
  quote,
  imageUpload,
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
  getUser,
  
  // Payment APIs
  paymentCheckout,
  paymentKey,
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
  
  // Team Member APIs
  taskAssign,
  editTask,
  getTask,
  updateStatus,
  updateComment,
  teamMetrices,
  
  // Email Configuration APIs
  emailConfigureCreate,
  emailConfigureSend,
  emailConfigureGet,
  getCompanies,
  changeClientPassword,
  
  // Chat APIs
  getAllConversation,
  getUserMessages,
  seenMessage,
  chatUserConversation,
  
  // Payment & Account APIs
  verifyAccount,
  createAccountStripe,
  createPaymentStripe,
  companyEditProfile,
  paymentProposals,
  paymentHistory,
  
  // Metrics APIs
  leadMetrices,
  clientMetrices,
  askPayment,
  updatePayment,
  sendOtherProposal,
  taskMetrices,
  
  // Notification APIs
  getNotification,
  deleteNotification,
  seenNotification,
  
  // Privacy & Terms APIs
  getPrivacyPolicy,
  getTerms,
  
  // Support APIs
  createSupport,
  getSupports,
  attendSupport,
  
  // FAQs APIs
  faqCrud,
  faqCatCrud,
  
  // Payment & Subscription APIs
  getCompaniesSubscriptions,
  getSubscriptionCard,
  paymentAddCard,
  
  // Bank APIs
  bankGet,
  bankPost,
  bankPut,
  bankDelete,
  
  // Category APIs
  createCat,
  editCat,
  allCat,
  allCatUsingPaging,
  catStatus,
  changeStatusCat,
  
  // Lot APIs
  createNewLot,
  editLot,
  getAllLots,
  getWithoutPagingLot,
  updateLotStatus,
  
  // Auction APIs
  createNewAuction,
  editAuction,
  updateAuctionStatus,
  getAllAuctionUsingPaging,
  adminEditAuctionStatus,
  auctionStatus,
  selectAuctionLot,
  getAuctionDetail,
  editAuctionApplication,
  deleteAuctionApplication,
  auctionBidWinners,
  orderUpdate,
  bidWinnerDetail,
  getLiveChat,
  auctionRegistrationTracking,
  createAuctionRegistration,
  editAuctionRegistration,
  getAuctionRegistration,
  privacyPages,
  getInvoiceDetail,
  updateUser,
  sendInvoice,
  getInvoices,
  editInvoice,
  updateTransaction,
  
  // Footer & Dashboard APIs
  footerCrud,
  footerImageUpload,
  dashboardMetrices,
  lotMetrices,
  auctionMetrices,
  paymentInvoicesMetrices,
  cashierMetrices,
  clearanceMetrices,
  auctioneerMetrices,
  
  // Support & Email APIs
  getSubscribeEmails,
  sendUpdates,
  
  // Deposit & Refund APIs
  refundProcess,
  stripeRefund,
  addToWallet,
  
  // Subcategory APIs
  subCatCreate,
  allSubCat,
  getPaginatedSubCat,
  editSubCat,
  subCatStatusUpdate,
  
  // User Authentication APIs (for our app)
  sendCode,
  verifyOtpRegistration,
  signup,
  forgotPassword,
  verifyOtpForgotPassword,
  updatePassword,
  changePassword,
  checkEmail,
  checkPhone,
  updateUserProfile,
  deleteUser,
  
  // User-specific order routes
  getUserOrders,
  getUserInvoices,
}; 