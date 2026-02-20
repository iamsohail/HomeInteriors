"use client";

import { useState } from "react";
import { Star, AlertTriangle, Lightbulb, Check } from "lucide-react";
import { Header } from "@/components/shared/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BANGALORE_RECOMMENDATIONS } from "@/lib/constants/recommendations";

const TIER_COLORS = {
  Budget: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "Mid-range": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Premium: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function RecommendationsPage() {
  const [selectedCategory, setSelectedCategory] = useState(
    BANGALORE_RECOMMENDATIONS[0].category
  );

  const category = BANGALORE_RECOMMENDATIONS.find(
    (r) => r.category === selectedCategory
  );

  return (
    <>
      <Header
        title="Recommendations"
        description="Bangalore-specific value-for-money options"
      />
      <div className="flex-1 p-4 md:p-6 space-y-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {BANGALORE_RECOMMENDATIONS.map((rec) => (
            <Button
              key={rec.category}
              variant={selectedCategory === rec.category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(rec.category)}
            >
              {rec.category}
            </Button>
          ))}
        </div>

        {category && (
          <>
            {/* 3-Tier Options */}
            <div className="grid gap-4 md:grid-cols-3">
              {category.options.map((opt) => (
                <Card key={opt.tier} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge className={TIER_COLORS[opt.tier]}>{opt.tier}</Badge>
                      {opt.tier === "Mid-range" && (
                        <Badge variant="outline" className="text-xs">
                          <Star className="size-3 mr-1" />
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base mt-2">{opt.vendor}</CardTitle>
                    <p className="text-sm text-muted-foreground">{opt.product}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-lg font-bold">{opt.priceRange}</p>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Pros</p>
                      <ul className="space-y-1">
                        {opt.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-sm">
                            <Check className="size-3.5 text-green-600 mt-0.5 shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Cons</p>
                      <ul className="space-y-1">
                        {opt.cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-sm text-muted-foreground">
                            <span className="text-orange-500 mt-0.5 shrink-0">-</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tips & Gotchas */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="size-4 text-yellow-500" />
                    Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.tips.map((tip, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-muted-foreground">{i + 1}.</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="size-4 text-orange-500" />
                    Watch Out
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.gotchas.map((gotcha, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-orange-500">!</span>
                        {gotcha}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
}
