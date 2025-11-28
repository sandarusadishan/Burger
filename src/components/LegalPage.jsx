import React from 'react';
import { Card } from './ui/card';

const LegalPage = ({ title, lastUpdated, content }) => {
  return (
    <main className="flex-grow py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-primary">
          {title}
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          Last Updated: {lastUpdated}
        </p>

        <Card className="p-8 glass shadow-lg space-y-8">
          {content.map((section, index) => (
            <div key={index} className="space-y-4 border-b border-white/10 pb-4 last:border-b-0">
              <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
              <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                {section.sections.map((item, i) => (
                  <li key={i} className="pl-4">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="text-sm pt-4 text-center text-primary/80">
            For any questions regarding this policy, please contact us.
          </div>
        </Card>
      </div>
    </main>
  );
};

export default LegalPage;