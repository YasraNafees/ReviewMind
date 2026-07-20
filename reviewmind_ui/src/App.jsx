import styles from "./styles/App.module.css";

import { useAuth } from "./hooks/useAuth";
import { useDashboard } from "./hooks/useDashboard";

import LoginScreen from "./components/LoginScreen";
import Sidebar from "./components/SideBar";
import OverviewPage from "./components/OverviewPage";
import ReviewsPage from "./components/ReviewPage";
import ComplaintsPage from "./components/ComplaintsPage";
import InsightsPage from "./components/InsightsPage";
import SourcesPage from "./components/SourcesPage";


const pageTitles = {
  overview: "Dashboard",
  reviews: "All Reviews",
  complaints: "Complaints",
  insights: "Insights",
  sources: "Sources",
};

function App() {
  const auth = useAuth();
  const d = useDashboard();

  if (!auth.isLoggedIn) {
    return (
      <LoginScreen
        email={auth.email}
        password={auth.password}
        loginError={auth.loginError}
        loginLoading={auth.loginLoading}
        setEmail={auth.setEmail}
        setPassword={auth.setPassword}
        handleLogin={auth.handleLogin}
      />
    );
  }

  const renderPage = () => {
    switch (d.activeNav) {
      case "reviews":
        return <ReviewsPage totalReviews={d.totalReviews} />;

      case "complaints":
        return (
          <ComplaintsPage
            clusters={d.clusters}
            maxComplaints={d.maxComplaints}
            loading={d.loading}
          />
        );

      case "insights":
        return (
          <InsightsPage
            summary={d.summary}
            summaryLoading={d.summaryLoading}
            onGenerate={d.getSummary}
          />
        );

      case "sources":
        return <SourcesPage totalReviews={d.totalReviews} />;

      default:
        return <OverviewPage {...d} />;
    }
  };

  return (
    <div className={styles.shell}>
      <Sidebar
        activeNav={d.activeNav}
        setActiveNav={d.setActiveNav}
        userName={auth.userName}   
        onLogout={auth.handleLogout}
      />

      <div className={styles.mainArea}>
        <div className={styles.topBar}>
          <div>
            <p className={styles.pageLabel}>{d.activeNav}</p>
            <h1 className={styles.pageTitle}>
              {pageTitles[d.activeNav]}
            </h1>
          </div>

          <button
            className={styles.refreshBtn}
            onClick={d.fetchDashboardData}
          >
            {d.loading ? "Refreshing..." : "Refresh data"}
          </button>
        </div>

        {d.fetchError && (
          <div className={styles.errorBanner}>
            {d.fetchError}
          </div>
        )}

        <div className={styles.pageContent}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;