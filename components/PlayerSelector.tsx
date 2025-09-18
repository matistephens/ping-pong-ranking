'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllPlayers, createPlayer } from '@/lib/actions';
import { useToast } from '@/components/ui/use-toast';

interface Player {
  id: string;
  name: string;
  createdAt: Date;
}

interface PlayerSelectorProps {
  label: string;
  value: string;
  onChange: (playerId: string) => void;
  excludePlayerId?: string; // To prevent selecting the same player for both sides
}

export function PlayerSelector({ label, value, onChange, excludePlayerId }: PlayerSelectorProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const fetchedPlayers = await getAllPlayers();
      setPlayers(fetchedPlayers);
    } catch (error) {
      toast({
        title: 'Error loading players',
        description: 'Failed to load players list',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlayer = async () => {
    if (!newPlayerName.trim()) {
      toast({
        title: 'Invalid name',
        description: 'Please enter a player name',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    try {
      const result = await createPlayer(newPlayerName.trim());
      
      if (result.success && result.player) {
        setPlayers(prev => [...prev, result.player!].sort((a, b) => a.name.localeCompare(b.name)));
        onChange(result.player.id);
        setNewPlayerName('');
        setShowAddForm(false);
        toast({
          title: 'Player created successfully!',
          description: `${result.player.name} has been added to the players list`,
        });
      } else {
        toast({
          title: 'Error creating player',
          description: result.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error creating player',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const selectedPlayer = players.find(p => p.id === value);
  const availablePlayers = players.filter(p => p.id !== excludePlayerId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="text-sm text-muted-foreground">Loading players...</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {!showAddForm ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {availablePlayers.map(player => (
              <Button
                key={player.id}
                type="button"
                variant={value === player.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange(player.id)}
                className="justify-start"
              >
                {player.name}
              </Button>
            ))}
          </div>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="w-full"
          >
            + Add New Player
          </Button>
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Add New Player</CardTitle>
            <CardDescription className="text-xs">
              Create a new player to add to the match
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input
              placeholder="Enter player name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreatePlayer();
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                onClick={handleCreatePlayer}
                disabled={isCreating || !newPlayerName.trim()}
                className="flex-1"
              >
                {isCreating ? 'Creating...' : 'Create Player'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAddForm(false);
                  setNewPlayerName('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {selectedPlayer && (
        <div className="text-sm text-muted-foreground">
          Selected: <span className="font-medium">{selectedPlayer.name}</span>
        </div>
      )}
    </div>
  );
}
