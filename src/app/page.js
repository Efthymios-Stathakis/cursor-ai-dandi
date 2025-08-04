"use client";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Github,
  Star,
  GitPullRequest,
  BarChart3,
  Zap,
  Check,
  ArrowRight,
  TrendingUp,
  Users,
  Activity,
  Play,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react"

export default function LandingPage() {
  const { data: session, status } = useSession();
  const [apiRequest, setApiRequest] = useState(JSON.stringify({
    repository: "foneandrew/web-basics-hello-world",
    branch: "main"
  }, null, 2));
  const [apiResponse, setApiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApiTest = async () => {
    setIsLoading(true);
    setError("");
    setApiResponse("");

    try {
      const requestData = JSON.parse(apiRequest);
      const response = await fetch('/api/github-summarizer/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      
      if (response.ok) {
        setApiResponse(JSON.stringify(responseData, null, 2));
      } else {
        setError(`Error: ${responseData.error || 'Failed to analyze repository'}`);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <Github className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold">Dandy GitHub Analyzer</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#features">
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#try-it-out">
            Try it out
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#pricing">
            Pricing
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#about">
            About
          </Link>
        </nav>
        <div className="ml-6 flex gap-2">
          {session ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Welcome, {session.user?.name || session.user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
              <Button size="sm" asChild>
                <Link href="/dashboards">Dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => signIn()}>
                Login
              </Button>
              <Button size="sm" onClick={() => signIn()}>Sign Up</Button>
            </>
          )}
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div
              className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-fit">
                    <Zap className="w-3 h-3 mr-1" />
                    AI-Powered Insights
                  </Badge>
                  <h1
                    className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Unlock Deep Insights from Any GitHub Repository
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Get comprehensive analysis, trending metrics, and actionable insights from open source repositories.
                    Track stars, pull requests, releases, and discover fascinating facts about any GitHub project.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  {session ? (
                    <Button size="lg" className="gap-2" asChild>
                      <Link href="/dashboards">
                        Go to Dashboard
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button size="lg" className="gap-2" onClick={() => signIn()}>
                      Start Analyzing Free
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                    <Github className="w-4 h-4" />
                    View Demo
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-green-500" />
                    No credit card required
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-green-500" />
                    Free tier available
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Image
                    alt="GitHub Analytics Dashboard"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-2xl"
                    height="400"
                    src="/placeholder.svg?height=400&width=600"
                    width="600" />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div
              className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="text-blue-600 bg-blue-50 border-blue-200">Features</Badge>
                <h2 className="text-4xl font-bold tracking-tighter sm:text-6xl lg:text-7xl text-blue-600">
                  Everything You Need to Analyze GitHub Repositories
                </h2>
                <p
                  className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From basic metrics to advanced insights, get a complete picture of any open source project.
                </p>
              </div>
            </div>
            <div
              className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid gap-6">
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold">Repository Summary</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Get comprehensive overviews including description, language breakdown, contributor stats, and
                    project health metrics.
                  </p>
                </div>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold">Star Tracking & Trends</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Monitor star growth over time, identify trending periods, and compare popularity metrics across
                    repositories.
                  </p>
                </div>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <GitPullRequest className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold">Pull Request Insights</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Track important PRs, merge patterns, contributor activity, and identify the most impactful changes.
                  </p>
                </div>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold">Version Updates</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Stay updated with latest releases, changelog analysis, and breaking change detection across
                    versions.
                  </p>
                </div>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold">Cool Facts & Statistics</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Discover interesting patterns, unusual commits, contributor milestones, and unique project
                    characteristics.
                  </p>
                </div>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold">Community Analysis</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Analyze contributor networks, community health, issue resolution patterns, and maintainer activity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Try it out Section */}
        <section id="try-it-out" className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div
              className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="text-blue-600 bg-blue-50 border-blue-200">Try it out</Badge>
                <h2 className="text-4xl font-bold tracking-tighter sm:text-6xl lg:text-7xl text-blue-600">
                  Test Our API Right Now
                </h2>
                <p
                  className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Experience the power of our GitHub repository analysis API. Enter a repository name and see the insights in real-time.
                  <span className="block mt-2 text-sm text-blue-600">
                    💡 This is a demo version. Sign up to get your own API key for unlimited access!
                  </span>
                </p>
              </div>
            </div>
            
            <div className="mx-auto max-w-6xl mt-12">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Input Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">API Request</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter the repository details in JSON format
                    </p>
                  </div>
                  <div className="relative">
                    <textarea
                      value={apiRequest}
                      onChange={(e) => setApiRequest(e.target.value)}
                      className="w-full h-64 p-4 font-mono text-sm bg-muted border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter JSON request..."
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        onClick={handleApiTest}
                        disabled={isLoading}
                        size="sm"
                        className="gap-2"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                        {isLoading ? "Analyzing..." : "Send Request"}
                      </Button>
                    </div>
                  </div>
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                </div>

                {/* Output Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">API Response</h3>
                    <p className="text-sm text-muted-foreground">
                      View the analysis results
                    </p>
                  </div>
                  <div className="relative">
                    <textarea
                      value={apiResponse}
                      readOnly
                      className="w-full h-64 p-4 font-mono text-sm bg-muted border rounded-lg resize-none focus:outline-none"
                      placeholder="Response will appear here..."
                    />
                    {apiResponse && (
                      <div className="absolute top-2 right-2">
                        <Button
                          onClick={() => setApiResponse("")}
                          size="sm"
                          variant="outline"
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Example Section */}
              <div className="mt-8 p-6 bg-muted rounded-lg">
                <h4 className="text-lg font-semibold mb-4">Example Request</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium mb-2">Popular Repositories to Try:</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• <code className="bg-background px-1 py-0.5 rounded">facebook/react</code></li>
                      <li>• <code className="bg-background px-1 py-0.5 rounded">vercel/next.js</code></li>
                      <li>• <code className="bg-background px-1 py-0.5 rounded">microsoft/vscode</code></li>
                      <li>• <code className="bg-background px-1 py-0.5 rounded">tensorflow/tensorflow</code></li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Request Format:</p>
                    <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
{`{
  "repository": "owner/repo-name",
  "branch": "main"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div
              className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="text-blue-600 bg-blue-50 border-blue-200">Pricing</Badge>
                <h2 className="text-4xl font-bold tracking-tighter sm:text-6xl lg:text-7xl text-blue-600">Simple, Transparent Pricing</h2>
                <p
                  className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Start free and scale as you grow. No hidden fees, no surprises.
                </p>
              </div>
            </div>
            <div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 max-w-5xl mx-auto mt-12">
              {/* Free Tier */}
              <Card className="relative">
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <CardDescription>Perfect for getting started</CardDescription>
                  <div className="text-3xl font-bold">
                    $0<span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">5 repository analyses per month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Basic insights and summaries</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Star tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Community support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  {session ? (
                    <Button className="w-full bg-transparent" variant="outline" asChild>
                      <Link href="/dashboards">Go to Dashboard</Link>
                    </Button>
                  ) : (
                    <Button className="w-full bg-transparent" variant="outline" onClick={() => signIn()}>
                      Get Started Free
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {/* Pro Tier */}
              <Card className="relative border-primary">
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">Most Popular</Badge>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>For serious developers and teams</CardDescription>
                  <div className="text-3xl font-bold">
                    $19<span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">100 repository analyses per month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Advanced insights and cool facts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">PR analysis and trends</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Version update tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Email notifications</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Priority support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  {session ? (
                    <Button className="w-full" asChild>
                      <Link href="/dashboards">Go to Dashboard</Link>
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={() => signIn()}>Start Pro Trial</Button>
                  )}
                </CardFooter>
              </Card>

              {/* Enterprise Tier */}
              <Card className="relative">
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>For large teams and organizations</CardDescription>
                  <div className="text-3xl font-bold">
                    $99<span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Unlimited repository analyses</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Custom integrations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">API access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Advanced analytics dashboard</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Team collaboration tools</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Dedicated support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  {session ? (
                    <Button className="w-full bg-transparent" variant="outline" asChild>
                      <Link href="/dashboards">Go to Dashboard</Link>
                    </Button>
                  ) : (
                    <Button className="w-full bg-transparent" variant="outline" onClick={() => signIn()}>
                      Contact Sales
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div
              className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tighter sm:text-6xl lg:text-7xl text-blue-600">
                  Ready to Analyze Your First Repository?
                </h2>
                <p
                  className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of developers who trust Dandy GitHub Analyzer for their repository insights.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                {session ? (
                  <Button size="lg" className="gap-2" asChild>
                    <Link href="/dashboards">
                      <Github className="w-4 h-4" />
                      Go to Dashboard
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" className="gap-2" onClick={() => signIn()}>
                    <Github className="w-4 h-4" />
                    Start Free Analysis
                  </Button>
                )}
                <Button variant="outline" size="lg">
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer
        className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 Dandy GitHub Analyzer. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy Policy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  );
}
