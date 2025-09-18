'use client';

import { AddMatchForm } from '@/components/AddMatchForm';
import { CurrentRatings } from '@/components/CurrentRatings';
import { WeeklyLeaderboard } from '@/components/WeeklyLeaderboard';
import { MonthlyLeaderboard } from '@/components/MonthlyLeaderboard';
import { RecentMatches } from '@/components/RecentMatches';
import { HistoryPage } from '@/components/HistoryPage';
import { useState } from 'react';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'history'>('dashboard');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">🏓 Ping Pong Tracker</h1>
          <p className="text-center text-muted-foreground">
            Track office ping-pong results with fair Elo-based rankings
          </p>
          
          {/* Navigation */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2 bg-muted p-1 rounded-lg">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('history')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'history'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                History
              </button>
            </div>
          </div>
        </div>

        {currentView === 'history' ? (
          <HistoryPage />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <AddMatchForm />
              <CurrentRatings />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <WeeklyLeaderboard />
              <MonthlyLeaderboard />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentMatches />
              <div className="space-y-4">
                <div className="p-6 rounded-lg border bg-card">
                  <h3 className="text-lg font-semibold mb-2">How Rankings Work</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• <strong>Elo Rating:</strong> Fair ranking system that adjusts based on match results</p>
                    <p>• <strong>Weekly Winner:</strong> Best win% with ≥2 matches in the week</p>
                    <p>• <strong>Monthly Champion:</strong> Best win% with ≥4 matches in the month</p>
                    <p>• <strong>Cups:</strong> Count of months won as champion</p>
                  </div>
                </div>
                
                <div className="p-6 rounded-lg border bg-card">
                  <h3 className="text-lg font-semibold mb-2">Match Rules</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Players choose best-of-N games format</p>
                    <p>• No ties allowed (games must be different)</p>
                    <p>• Retroactive entries supported</p>
                    <p>• All times in America/Denver timezone</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
