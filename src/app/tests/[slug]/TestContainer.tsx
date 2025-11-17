'use client';

import { useState, useEffect } from 'react';
import { TestIntro } from '@/components/test/TestIntro';
import { QuestionFlow } from '@/components/test/QuestionFlow';
import { TestWithQuestions } from '@/lib/data/tests';

interface TestContainerProps {
  test: TestWithQuestions;
}

export function TestContainer({ test }: TestContainerProps) {
  const [started, setStarted] = useState(false);

  // Reset test when navigating back from result page (bfcache)
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      // If page was restored from bfcache, reset to initial state
      if (event.persisted) {
        setStarted(false);
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  if (!started) {
    return (
      <TestIntro
        title={test.title}
        description={test.description}
        questionCount={test.question_count}
        estimatedTime={test.estimated_time}
        onStart={() => setStarted(true)}
      />
    );
  }

  return <QuestionFlow test={test} />;
}
