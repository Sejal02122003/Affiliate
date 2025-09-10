
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import AccountPage from './components/AccountPage';

// Profile Management Pages
import ProfilePage from './components/Profile/ProfilePage';
import BasicInformation from './components/Profile/BasicInformation';
import ContactDetails from './components/Profile/ContactDetails';
import ProfilePicture from './components/Profile/ProfilePicture';
import BioPreferences from './components/Profile/BioPreferences';

// Orders & Purchases Pages
import OrdersPage from './pages/OrdersPage';
import ActiveOrders from './pages/ActiveOrders';
import OrderHistory from './pages/OrderHistory';
import ReturnsRefunds from './pages/ReturnsRefunds';
import TrackPackage from './pages/TrackPackage';
import WishlistPage from './pages/WishlistPage';

// Payment & Address Pages
import AddressesPage from './pages/AddressesPage';
import PaymentMethodsPage from './pages/PaymentMethodsPage';

// Communication Pages
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';

// Rewards & Offers Pages
import CouponsPage from './pages/CouponsPage';
import AnalyticsPage from './pages/AnalyticsPage';

// Security & Settings Pages
import SecurityPage from './pages/SecurityPage';
import SettingsPage from './pages/SettingsPage';

// Support & Help Pages
import SupportPage from './pages/SupportPage';

import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/overview" replace />} />
            
            {/* Overview */}
            <Route path="/overview" element={<AccountPage />} />
            
            {/* Profile Management */}
            <Route path="/profile/*" element={<ProfilePage />}>
              <Route path="basic" element={<BasicInformation />} />
              <Route path="contact" element={<ContactDetails />} />
              <Route path="picture" element={<ProfilePicture />} />
              <Route path="bio" element={<BioPreferences />} />
              <Route index element={<Navigate to="basic" replace />} />
            </Route>
            
            {/* Orders & Purchases */}
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/active" element={<ActiveOrders />} />
            <Route path="/orders/history" element={<OrderHistory />} />
            <Route path="/orders/returns" element={<ReturnsRefunds />} />
            <Route path="/orders/tracking" element={<TrackPackage />} />
            
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/wishlist/all" element={<WishlistPage />} />
            <Route path="/wishlist/available" element={<WishlistPage />} />
            <Route path="/wishlist/out-of-stock" element={<WishlistPage />} />
            <Route path="/wishlist/on-sale" element={<WishlistPage />} />
            
            {/* Payment & Address */}
            <Route path="/addresses" element={<AddressesPage />} />
            <Route path="/addresses/shipping" element={<AddressesPage />} />
            <Route path="/addresses/billing" element={<AddressesPage />} />
            <Route path="/addresses/add" element={<AddressesPage />} />
            
            <Route path="/payment" element={<PaymentMethodsPage />} />
            <Route path="/payment/cards" element={<PaymentMethodsPage />} />
            <Route path="/payment/bank" element={<PaymentMethodsPage />} />
            <Route path="/payment/wallets" element={<PaymentMethodsPage />} />
            <Route path="/payment/add" element={<PaymentMethodsPage />} />
            
            {/* Communication */}
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/messages/inbox" element={<MessagesPage />} />
            <Route path="/messages/sent" element={<MessagesPage />} />
            <Route path="/messages/orders" element={<MessagesPage />} />
            <Route path="/messages/promotions" element={<MessagesPage />} />
            
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/notifications/email" element={<NotificationsPage />} />
            <Route path="/notifications/sms" element={<NotificationsPage />} />
            <Route path="/notifications/push" element={<NotificationsPage />} />
            <Route path="/notifications/marketing" element={<NotificationsPage />} />
            
            {/* Rewards & Offers */}
            <Route path="/coupons" element={<CouponsPage />} />
            <Route path="/coupons/available" element={<CouponsPage />} />
            <Route path="/coupons/used" element={<CouponsPage />} />
            <Route path="/coupons/expired" element={<CouponsPage />} />
            <Route path="/coupons/referral" element={<CouponsPage />} />
            
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/analytics/spending" element={<AnalyticsPage />} />
            <Route path="/analytics/categories" element={<AnalyticsPage />} />
            <Route path="/analytics/monthly" element={<AnalyticsPage />} />
            <Route path="/analytics/savings" element={<AnalyticsPage />} />
            
            {/* Security & Settings */}
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/security/password" element={<SecurityPage />} />
            <Route path="/security/2fa" element={<SecurityPage />} />
            <Route path="/security/history" element={<SecurityPage />} />
            <Route path="/security/privacy" element={<SecurityPage />} />
            
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/general" element={<SettingsPage />} />
            <Route path="/settings/language" element={<SettingsPage />} />
            <Route path="/settings/accessibility" element={<SettingsPage />} />
            <Route path="/settings/export" element={<SettingsPage />} />
            
            {/* Support & Help */}
            <Route path="/support" element={<SupportPage />} />
            <Route path="/support/faq" element={<SupportPage />} />
            <Route path="/support/contact" element={<SupportPage />} />
            <Route path="/support/chat" element={<SupportPage />} />
            <Route path="/support/report" element={<SupportPage />} />
          </Routes>
        </Layout>
    </ThemeProvider>
  );
}

export default App;
