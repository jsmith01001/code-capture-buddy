import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Users, Target, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">About Sokovuma</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your trusted partner in agriculture. We connect farmers, suppliers, and agricultural enthusiasts 
            to build a sustainable and thriving agricultural community.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To revolutionize agriculture by providing a comprehensive platform that connects 
                farmers with quality supplies, tools, and knowledge. We aim to make farming more 
                accessible, profitable, and sustainable for everyone.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To become the leading agricultural marketplace that empowers farmers worldwide, 
                fostering innovation, sustainability, and growth in the agricultural sector while 
                ensuring food security for future generations.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Our Values
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Quality</h3>
                <p className="text-sm text-muted-foreground">
                  We ensure only the highest quality products and services reach our community.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Trust</h3>
                <p className="text-sm text-muted-foreground">
                  Building lasting relationships through transparency and reliability.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  Embracing technology to solve agricultural challenges and improve outcomes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Story */}
        <Card>
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Founded with a passion for agriculture and technology, Sokovuma emerged from the 
              recognition that farmers needed better access to quality supplies and markets. 
              Our founders, with backgrounds in both agriculture and technology, saw an opportunity 
              to bridge the gap between traditional farming and modern commerce.
            </p>
            <p className="text-muted-foreground mb-4">
              Today, we serve thousands of farmers, suppliers, and agricultural enthusiasts across 
              the region, providing everything from seeds and tools to fertilizers and equipment. 
              Our platform has become a trusted marketplace where quality meets convenience.
            </p>
            <p className="text-muted-foreground">
              As we continue to grow, we remain committed to our core mission: empowering the 
              agricultural community with the tools, products, and knowledge they need to succeed 
              in an ever-changing world.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;