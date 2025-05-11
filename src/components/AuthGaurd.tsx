import { useEffect } from 'react';
import { useUserContext } from '@/context/UserContext';
import { useAuth0 } from '@auth0/auth0-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FullPageSpinner from './Authentication/FullPageSpinner';

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { loginWithRedirect, isAuthenticated, isLoading: isAuthLoading } = useAuth0();
  const { user, isBackendLoading, isLoggedOut } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthLoading || isBackendLoading) return;

    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    if (!user?._id && !isLoggedOut) {
      navigate('/error');
    }
  }, [isAuthenticated, isAuthLoading, isBackendLoading, user, navigate]);

  const showSpinner =
    isAuthLoading || isBackendLoading || !isAuthenticated || (!user?._id && !isLoggedOut);

  return (
    <AnimatePresence mode="wait">
      {showSpinner ? (
        <motion.div
          key="loader"
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.4 }}
        >
          <FullPageSpinner />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthGuard;
