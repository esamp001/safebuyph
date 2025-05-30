import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
export default function PricingTabs() {
  return (
    <Tabs
      defaultValue="transaction"
      className="w-full max-w-6xl mx-auto flex flex-col items-center"
    >
      <TabsList className="flex justify-center w-fit mx-auto bg-[#f0f0f0] p-2 rounded-xl">
        <TabsTrigger
          value="transaction"
          className="px-6 py-3 text-base rounded-lg hover:bg-white transition-all"
        >
          Per-Transaction Fee
        </TabsTrigger>
        <TabsTrigger
          value="subscription"
          className="px-6 py-3 text-base rounded-lg hover:bg-white transition-all"
        >
          Subscription Plan
        </TabsTrigger>
      </TabsList>
      <TabsContent value="transaction" className="text-center mt-6">
        <div className="flex flex-col gap-6 w-full">
          <Card className="w-full p-6 bg-white shadow-lg">
            <h2 className="text-2xl font-bold mb-4 font-poppins">Per-Transaction Fee</h2>
            <p className="text-lg mb-4 font-poppins">
              1.5% – 3% per transaction (minimum ₱20, maximum ₱500)
            </p>
            <p className="text-gray-600 font-poppins">Perfect for casual users. No monthly fees.</p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-3 font-poppins">Small Transaction</h3>
              <div className="space-y-2">
                <p className="text-2xl font-bold font-poppins">₱1,000</p>
                <p className="text-gray-600 font-poppins">Transaction Amount</p>
                <div className="border-t pt-2">
                  <p className="text-lg font-semibold font-poppins">₱20</p>
                  <p className="text-sm text-gray-600 font-poppins">Minimum Fee</p>
                </div>
                <div className="flex justify-center">
                  <Button className="bg-white text-[#1eafd0] hover:bg-gray-100 rounded-full font-bold h-10 px-4 text-sm flex items-center gap-2">
                    Get Started
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-3 font-poppins">Medium Transaction</h3>
              <div className="space-y-2">
                <p className="text-2xl font-bold font-poppins">₱10,000</p>
                <p className="text-gray-600 font-poppins">Transaction Amount</p>
                <div className="border-t pt-2">
                  <p className="text-lg font-semibold font-poppins">₱150</p>
                  <p className="text-sm text-gray-600 font-poppins">1.5% Fee</p>
                </div>
                <div className="flex justify-center">
                  <Button className="bg-white text-[#1eafd0] hover:bg-gray-100 rounded-full font-bold h-10 px-4 text-sm flex items-center gap-2">
                    Get Started
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-3 font-poppins">Large Transaction</h3>
              <div className="space-y-2">
                <p className="text-2xl font-bold font-poppins">₱50,000</p>
                <p className="text-gray-600 font-poppins">Transaction Amount</p>
                <div className="border-t pt-2">
                  <p className="text-lg font-semibold font-poppins">₱500</p>
                  <p className="text-sm text-gray-600 font-poppins">Maximum Fee</p>
                </div>
                <div className="flex justify-center">
                  <Button className="bg-white text-[#1eafd0] hover:bg-gray-100 rounded-full font-bold h-10 px-4 text-sm flex items-center gap-2">
                    Get Started
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="subscription" className="text-center mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow max-w-xs mx-auto">
            <h3 className="text-xl font-semibold mb-3 text-[#1eafd0] font-poppins">Monthly Plan</h3>
            <div className="space-y-4">
              <p className="text-3xl font-bold font-poppins">
                ₱499<span className="text-lg text-gray-600 font-poppins">/month</span>
              </p>
              <p className="text-gray-600 font-poppins text-sm">
                Ideal for growing businesses and active sellers looking to scale their operations
              </p>
              <ul className="text-left space-y-2">
                <li className="flex items-center font-poppins">
                  <span className="mr-2">✓</span>
                  20 transactions included
                </li>
                <li className="flex items-center font-poppins">
                  <span className="mr-2">✓</span>
                  Priority support
                </li>
                <li className="flex items-center font-poppins">
                  <span className="mr-2">✓</span>
                  Lower fees after limit
                </li>
              </ul>
              <div className="flex justify-center">
                <Button className="bg-white text-[#1eafd0] hover:bg-gray-100 rounded-full font-bold h-10 px-4 text-sm flex items-center gap-2">
                  Choose Monthly Plan
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow max-w-xs mx-auto">
            <h3 className="text-xl font-semibold mb-3 text-[#1eafd0] font-poppins">Yearly Plan</h3>
            <div className="space-y-4">
              <p className="text-3xl font-bold font-poppins">
                ₱4,999<span className="text-lg text-gray-600 font-poppins">/year</span>
              </p>
              <p className="text-gray-600 font-poppins text-sm">
                Ideal for established businesses looking for long-term savings
              </p>
              <ul className="text-left space-y-2">
                <li className="flex items-center font-poppins">
                  <span className="mr-2">✓</span>
                  250 transactions included
                </li>
                <li className="flex items-center font-poppins">
                  <span className="mr-2">✓</span>
                  Priority support
                </li>
                <li className="flex items-center font-poppins">
                  <span className="mr-2">✓</span>
                  Lowest fees after limit
                </li>
                <li className="flex items-center font-poppins">
                  <span className="mr-2">✓</span>
                  Save ₱989 annually
                </li>
              </ul>
              <div className="flex justify-center">
                <Button className="bg-white text-[#1eafd0] hover:bg-gray-100 rounded-full font-bold h-10 px-4 text-sm flex items-center gap-2">
                  Choose Yearly Plan
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
