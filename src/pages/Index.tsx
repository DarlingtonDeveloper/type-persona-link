import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DynamicBackground from "@/components/DynamicBackground";
import { Search, Users, Zap, Shield, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { USER_CODE, APP_CONFIG, ERROR_MESSAGES } from "@/constants";

const Index = () => {
  const [userCode, setUserCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCodeSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter an E3 Circle code",
        variant: "destructive"
      });
      return;
    }

    // Validate user code format
    if (!USER_CODE.PATTERN.test(userCode.toUpperCase())) {
      toast({
        title: "Invalid Format",
        description: `E3 Circle code must be ${USER_CODE.LENGTH} characters (letters and numbers only)`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Check if user code exists
      const { data, error } = await supabase
        .from('users')
        .select('user_code, is_onboarding_complete')
        .eq('user_code', userCode.toUpperCase())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            title: "Code Not Found",
            description: ERROR_MESSAGES.USER_NOT_FOUND,
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return;
      }

      // Navigate to user profile
      navigate(`/${userCode.toUpperCase()}`);

    } catch (error) {
      console.error('Error searching for user code:', error);
      toast({
        title: "Error",
        description: ERROR_MESSAGES.GENERIC_ERROR,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Users,
      title: "Personal Profiles",
      description: "Create your unique digital identity with custom links and information"
    },
    {
      icon: Zap,
      title: "Instant Setup",
      description: "Quick 5-step onboarding process to get your profile live in minutes"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security measures"
    }
  ];

  return (
    <DynamicBackground>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E3</span>
                </div>
                <span className="text-white font-semibold text-xl">{APP_CONFIG.NAME.split(' ')[1]}</span>
              </div>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Get Started
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-4xl">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Your Digital
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Identity Hub
                </span>
              </h1>
              <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                {APP_CONFIG.DESCRIPTION}. Connect all your social links, showcase your personality,
                and share your digital presence with a single, personalized profile page.
              </p>
            </div>

            {/* Search Section */}
            <div className="flex justify-center mb-16">
              <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center flex items-center justify-center gap-2">
                    <Search className="h-5 w-5" />
                    Find E3 Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCodeSearch} className="space-y-4">
                    <div>
                      <Input
                        placeholder={`Enter E3 Circle code (e.g., ${USER_CODE.PLACEHOLDER})`}
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value.toUpperCase())}
                        className="text-center font-mono text-lg"
                        maxLength={USER_CODE.LENGTH}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        "Searching..."
                      ) : (
                        <>
                          View Profile
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Don't have a code? Contact your {APP_CONFIG.NAME} administrator.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-6 text-center">
                    <feature.icon className="h-12 w-12 mx-auto mb-4 text-blue-300" />
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-white/80 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Demo Section */}
            <div className="text-center">
              <Alert className="bg-blue-500/20 border-blue-300/30 text-white max-w-md mx-auto">
                <AlertDescription>
                  <strong>Try a demo:</strong> Enter "{USER_CODE.PLACEHOLDER}" to see a sample profile in action
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/10 backdrop-blur-sm border-t border-white/20 py-6">
          <div className="container mx-auto px-4 text-center text-white/60">
            <p>&copy; 2024 {APP_CONFIG.NAME}. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </DynamicBackground>
  );
};

export default Index;