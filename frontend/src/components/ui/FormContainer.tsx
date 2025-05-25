import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import { JSX } from 'react';

import { TValue } from '@/domain/types/formState';
import { useFormStore } from '@/hooks/useFormStore';

const MotionBox = motion.create(Box);

export default function FormContainer({
  children,
  formName,
}: {
  children: React.ReactNode;
  formName: TValue;
}): JSX.Element {
  const theme = useTheme();
  const { forms, setIsOpen } = useFormStore();

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.95, transition: { duration: 0.8 } },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
  };

  const collapsedWidth = 70;
  const expandedWidth = 600;

  return (
    <MotionBox
      layout
      initial={false}
      animate={{
        width: forms[formName].isOpen ? expandedWidth : collapsedWidth,
      }}
      transition={{
        duration: 0.8,
        ease: 'easeInOut',
      }}
      style={{
        padding: theme.spacing(1),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          padding: forms[formName].isOpen ? 2 : 0,
          gap: theme.spacing(2),
          borderRadius: 1,
          boxShadow: 0,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey[900]),
          overflow: 'hidden',
          height: '100%',
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <AnimatePresence initial={false} mode="wait">
          {forms[formName].isOpen ? (
            <MotionBox
              key="form-content"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing(2),
              }}
            >
              <Box
                onClick={() => setIsOpen(false, formName)}
                sx={{
                  alignSelf: 'flex-end',
                  cursor: 'pointer',
                  lineHeight: 0,
                  mb: 1,
                  color: theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.common.white,
                }}
              >
                <CloseFullscreenIcon sx={{ fontSize: 34 }} />
              </Box>
              {children}
            </MotionBox>
          ) : (
            <MotionBox
              key="form-icon"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
              sx={{ alignSelf: 'center' }}
            >
              <Box
                onClick={() => setIsOpen(true, formName)}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 0,
                  color: theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.common.white,
                }}
              >
                <DynamicFormIcon sx={{ fontSize: 34 }} />
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    </MotionBox>
  );
}
