import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Coins, ArrowRight, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
const Index = () => {
  const [email, setEmail] = useState('');
  const isMobile = useIsMobile();
  const {
    toast
  } = useToast();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Success!",
        description: "Thank you for signing up for early access. We'll be in touch soon!"
      });
      setEmail('');
    }
  };
  const benefits = ["Makes searching super easy and quick", "Removes the guesswork", <>Shows you <u>rental</u> and <u>value-add</u> investment options (flip, add-on, adu, scrape)</>, "No complicated spreadsheets! Automated deal summaries (proforma's) provided."];
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-4 lg:py-8 relative">
        <div className="flex flex-col items-center space-y-2">
          <img src="/lovable-uploads/05aea857-8655-4de2-982c-bf16fd500ec9.png" alt="Real Deal Logo" className="h-6 sm:h-8 lg:h-12 w-auto" />
          <p className="text-sm sm:text-base lg:text-lg font-montserrat font-semibold text-foreground tracking-wide uppercase">
            Real Estate Deals <span className="shimmer-text">Revealed</span>
          </p>
        </div>
        <Button asChild variant="outline" size="lg" className="absolute top-4 lg:top-8 right-4 px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base">
          <a href="https://app.getrealdeal.ai" target="_blank" rel="noopener noreferrer">
            app.getrealdeal.ai
          </a>
        </Button>
      </header>

      {/* Hero Section with Muted Background */}
      <div className="bg-muted">
        {/* Main Hero Content */}
        <main className="container mx-auto px-4 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8 lg:space-y-12">
              <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-inter font-black text-foreground leading-tight uppercase tracking-tight">
                  Find Real Estate Deals <em className="text-highlight">FAST</em>
                </h1>
                <p className="text-lg lg:text-2xl text-muted-foreground leading-relaxed font-inter">
                  Real Deal instantly analyzes on-market listings and only shows you the opportunities.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-6 lg:space-y-8">
                {benefits.map((benefit, index) => <div key={index} className="flex items-start gap-4 lg:gap-5">
                    <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 bg-success rounded-full flex items-center justify-center mt-1">
                      <Check className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <p className="text-foreground text-base lg:text-xl font-inter leading-relaxed">{benefit}</p>
                  </div>)}
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative order-first lg:order-last">
              <div className="rounded-2xl overflow-hidden shadow-elegant transform scale-100 lg:scale-105">
                <img src="/lovable-uploads/1b1a09a0-1772-49c2-a779-bfbe28a536ad.png" alt="Real Deal Platform showing investment opportunities" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Premium CTA Section */}
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="flex justify-center">
          <Card className="p-6 lg:p-10 bg-gradient-primary border-0 w-full lg:w-3/4 shadow-glow">
            <CardContent className="p-0">
              <div className="space-y-6 lg:space-y-8">
                <h3 className="text-xl lg:text-3xl font-poppins font-bold text-white text-center uppercase tracking-tight">
                  Ready to Find Your Next Deal?
                </h3>
                <div className="flex justify-center">
                  <Button asChild variant="outline" size="lg" className="px-8 lg:px-12 py-6 lg:py-8 text-lg lg:text-xl bg-white text-primary border-white hover:bg-white/90">
                    <a href="https://app.getrealdeal.ai" target="_blank" rel="noopener noreferrer">
                      Show Me
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testimonial */}
        <div className="flex justify-center mt-12 lg:mt-24 px-4">
          <div className="flex flex-col sm:flex-row items-start gap-6 lg:gap-8 max-w-4xl">
            <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full flex-shrink-0 overflow-hidden ring-4 ring-accent mx-auto sm:mx-0">
              <img src="/lovable-uploads/78eb1237-ca68-4e3f-83fe-c87299ddf807.png" alt="Donald Speedie" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-lg lg:text-2xl font-poppins font-bold text-highlight mb-3 lg:mb-4">Love it!</p>
              <p className="text-base lg:text-xl leading-relaxed font-inter text-foreground mb-4 lg:mb-6">
                "Real Deal is so new, we don't even have any other testimonies yet. But we built this tool for ourselves and love the speed and ease that this it brings to the process, saving us hours on each deal. Built by a builder."
              </p>
              <p className="text-sm lg:text-lg text-muted-foreground font-poppins font-semibold">
                Donald Speedie, Nimble Development LLC
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Investor Types Section */}
      <div className="bg-muted py-12 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="flex justify-center order-first lg:order-first">
              <img src="/lovable-uploads/5c80c350-9c77-47d4-80fa-f714baffd319.png" alt="Example property listing with investment details" className="w-full max-w-sm lg:max-w-xl rounded-2xl shadow-elegant transform scale-100 lg:scale-105" />
            </div>
            <div className="space-y-6 lg:space-y-8 p-6 lg:p-10 bg-gradient-accent rounded-2xl shadow-glow">
              <h3 className="text-xl lg:text-3xl font-poppins font-bold text-white uppercase tracking-tight text-center lg:text-left">
                What kind of investor are you?
              </h3>
              <div className="space-y-4 lg:space-y-6 text-white">
                <p className="text-base lg:text-xl font-inter leading-relaxed">
                  Want a hands-off investment? Search the rentals that work for you.
                </p>
                <p className="text-base lg:text-xl font-inter leading-relaxed">
                  Don't mind rolling up your sleeves? Value-Add potential is revealed — across flips, ADUs, add-ons, and scrapes as well — without wasting your time.
                </p>
                <p className="font-poppins font-bold text-lg lg:text-2xl">
                  No more guesswork. No more analysis paralysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12 lg:py-24">
        {/* Token Pricing */}
        <div className="flex justify-center mb-16 lg:mb-32">
          <div className="flex flex-col sm:flex-row items-start gap-4 lg:gap-6 p-6 lg:p-10 bg-gradient-primary rounded-2xl max-w-4xl shadow-glow">
            <Coins className="w-8 h-8 lg:w-12 lg:h-12 text-white flex-shrink-0 mt-1 lg:mt-2 mx-auto sm:mx-0" />
            <p className="text-lg lg:text-xl font-inter leading-relaxed text-white text-center sm:text-left">
              <strong className="font-poppins font-bold text-xl lg:text-2xl">Only pay for what you use.</strong> See a deal that you like? Use tokens to gain access to the details of a deal. No more expensive, unused subscriptions to pay for. Get started today with 3 free deals.
            </p>
          </div>
        </div>

        {/* Three Column Layout - Mobile: Stack vertically */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 mb-16 lg:mb-32">
          <div className="w-full max-w-xs lg:w-72 lg:h-72">
            <img src="/lovable-uploads/0e7cb467-472b-4395-ae91-40a7ce1b9e7d.png" alt="Real estate opportunities map" className="w-full h-auto lg:h-full object-cover rounded-2xl shadow-elegant" />
          </div>
          <div className="flex flex-col items-center gap-4 px-4 lg:px-8">
            <div className="relative w-24 h-24 lg:w-36 lg:h-36 flex items-center justify-center">
              {isMobile ? <>
                  <ArrowDown className="absolute w-24 h-24 text-warning animate-[slide-down_2s_ease-in-out_infinite]" />
                  <ArrowDown className="absolute w-24 h-24 text-warning animate-[slide-down_2s_ease-in-out_infinite_0.6s]" />
                  <ArrowDown className="absolute w-24 h-24 text-warning animate-[slide-down_2s_ease-in-out_infinite_1.2s]" />
                </> : <>
                  <ArrowRight className="absolute w-24 h-24 lg:w-36 lg:h-36 text-warning animate-[slide-right_2s_ease-in-out_infinite]" />
                  <ArrowRight className="absolute w-24 h-24 lg:w-36 lg:h-36 text-warning animate-[slide-right_2s_ease-in-out_infinite_0.6s]" />
                  <ArrowRight className="absolute w-24 h-24 lg:w-36 lg:h-36 text-warning animate-[slide-right_2s_ease-in-out_infinite_1.2s]" />
                </>}
            </div>
            <p className="text-base lg:text-lg font-poppins font-bold text-foreground text-center">
              Turns endless listings into a shortlist of viable opportunities in seconds.
            </p>
          </div>
          <div className="w-full max-w-xs lg:w-72 lg:h-72">
            <img src="/lovable-uploads/c700612a-f225-4182-8ec0-3a4ec231c051.png" alt="Real estate opportunities map with location pins" className="w-full h-auto lg:h-full object-cover rounded-2xl shadow-elegant" />
          </div>
        </div>
        
        {/* Moved gradient section */}
        <div className="flex justify-center mb-16 lg:mb-32">
          <div className="bg-gradient-accent p-6 lg:p-8 rounded-2xl shadow-glow max-w-4xl w-full">
            <ul className="text-lg lg:text-2xl text-white font-inter leading-relaxed space-y-4">
              <li className="flex items-start gap-3">
                <span>Get bank-ready proformas in seconds...</span>
              </li>
            </ul>
            <div className="mt-6 flex justify-center">
              <img src="/lovable-uploads/7912f74c-2c12-477a-b718-a4617a8e2a97.png" alt="Example proforma showing rental income analysis" className="rounded-lg shadow-lg max-w-xs lg:max-w-sm w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Tools Section */}
      <div className="bg-muted py-12 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-12 lg:mb-20">
            <div className="w-full max-w-4xl space-y-6 lg:space-y-8 text-center">
              <img src="/lovable-uploads/404363b2-e447-4717-8003-532f695be474.png" alt="Property comparables showing market analysis" className="w-full lg:w-1/2 h-auto rounded-2xl shadow-elegant transform scale-100 lg:scale-105 mx-auto" />
              <p className="text-lg lg:text-2xl font-poppins font-bold text-foreground px-4">
                Analyze comps onscreen to fine tune your ARV (After Repair Value).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 lg:py-16">
        <div className="text-center text-muted-foreground space-y-4">
          <p className="text-sm lg:text-base font-inter max-w-3xl mx-auto">
            getRealDeal.ai provides tools for analyzing real estate investments such as calculators and estimates. We make no guarantees as to the accuracy of the information provided. User is required to verify all amounts and calculations before relying on this information.
          </p>
          <p className="text-lg lg:text-xl font-inter">&copy; 2024 Real Deal. All rights reserved.</p>
        </div>
      </footer>
    </div>;
};
export default Index;