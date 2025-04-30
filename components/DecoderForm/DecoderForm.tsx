
'use client';

import { ReactNode, useEffect } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  admin?: boolean;
}