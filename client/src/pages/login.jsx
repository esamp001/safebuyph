import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginHeader from '@/components/ui/loginHeader';

function Login() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <LoginHeader />

      <div className="flex items-center flex-1 bg-gray-50 justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Buy Smarter, Sell Safely</CardTitle>
            <CardDescription>
              Join our marketplace today and experience secure trading.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email
                </label>
                <Input type="email" placeholder="m@example.com" className="w-full" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Password
                </label>
                <Input type="password" className="w-full" />
              </div>
              <Button className="w-full">Login</Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-50 px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => {}}>
                <FcGoogle className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button variant="outline" className="w-full" onClick={() => {}}>
                <FaFacebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Login;
