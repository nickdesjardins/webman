import { ArrowRight, Download, FileText } from "lucide-react";

import type { Locale } from "@/lib/i18n";
import { getContent } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { experienceStrings } from "@/components/experience/strings";

interface ResumeCardProps {
  locale: Locale;
}

export function ResumeCard({ locale }: ResumeCardProps) {
  const { site } = getContent(locale);
  const t = experienceStrings(locale);

  return (
    <Card className="gap-4 border-border/70 py-5 sm:py-6">
      <CardHeader className="gap-1.5 px-5 sm:px-6">
        <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <FileText className="size-4 shrink-0 text-primary" aria-hidden="true" />
          {t.resume}
        </h3>
        <CardDescription>{t.resumeTagline}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 px-5 sm:flex-row sm:px-6 lg:flex-col">
        <Button asChild className="w-full sm:w-auto lg:w-full">
          <a href={site.links.resume} download={site.links.resumeFileName} type="application/pdf">
            <Download aria-hidden="true" />
            {t.downloadResume}
          </a>
        </Button>
        <Button asChild variant="ghost" className="w-full text-muted-foreground sm:w-auto lg:w-full">
          <a href="#contact">
            {t.sayHello}
            <ArrowRight aria-hidden="true" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
