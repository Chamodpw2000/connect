import { login } from '@/actions/auth.actions';
import LoginClientWrapper from '@/components/auth/loginClientWrapper';

export default function LoginPage() {
  return (
    <LoginClientWrapper login={login} />
  )
}
