import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginHeader from '@/components/ui/loginHeader';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/facebook';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col bg-[#FFFF]">
      <LoginHeader />
      <div className="flex justify-center mt-10">
        <h1 className="text-3xl font-bold text-center text-[#1f3f6f]">Sign in to SafeBuyPH</h1>
      </div>
      <div className="flex items-center flex-1 bg-gray-50 justify-center bg-[#FFFF]">
        <Card className="w-[400px] shadow-xl border-none mt-[-30px] bg-[#dce1e6]">
          <CardHeader>
            <CardTitle className="text-[#1f3f6f]">Buy Smarter, Sell Safely</CardTitle>
            <CardDescription>
              Join our marketplace today and experience secure trading.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-[#1f3f6f] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email
                </label>
                <Input type="email" placeholder="m@example.com" className="w-full bg-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#1f3f6f] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Password
                </label>
                <Input type="password" className="w-full bg-white" />
              </div>
              <Button className="w-full bg-[#0e1d54] hover:bg-[#597aaf] focus:ring-0 focus:outline-none border-none">
                Login
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className=" px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                  <FcGoogle className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button variant="outline" className="w-full" onClick={handleFacebookLogin}>
                  <FaFacebook className="mr-2 h-4 w-4" />
                  Facebook
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  By continuing, you acknowledge that you understand and agree to the{' '}
                  <a href="#" className="hover:underline">
                    Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Login;
