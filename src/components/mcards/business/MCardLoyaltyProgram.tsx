import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLoyaltyProgram } from '@/hooks/useLoyaltyProgram';
import { 
  Gift, 
  Star, 
  Users, 
  Settings, 
  Plus,
  Loader2,
  Trophy,
  Coins,
  Percent,
  TrendingUp,
  Edit,
  Trash2
} from 'lucide-react';

interface MCardLoyaltyProgramProps {
  mcardId: string;
}

const rewardTypeLabels: Record<string, string> = {
  discount: 'Réduction (%)',
  gift: 'Cadeau',
  vip: 'Statut VIP',
  free_service: 'Service gratuit'
};

const rewardTypeIcons: Record<string, React.ReactNode> = {
  discount: <Percent className="h-4 w-4" />,
  gift: <Gift className="h-4 w-4" />,
  vip: <Trophy className="h-4 w-4" />,
  free_service: <Star className="h-4 w-4" />
};

export const MCardLoyaltyProgram = ({ mcardId }: MCardLoyaltyProgramProps) => {
  const {
    program,
    rewards,
    customerPoints,
    loading,
    createOrUpdateProgram,
    createReward,
    updateReward,
    deleteReward
  } = useLoyaltyProgram(mcardId);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRewardDialogOpen, setIsRewardDialogOpen] = useState(false);
  const [settings, setSettings] = useState({
    pointsPerPurchase: 10,
    pointsPerFavorite: 5,
    pointsPerMessage: 2
  });
  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    pointsRequired: 100,
    rewardType: 'discount',
    rewardValue: 10,
    maxRedemptions: null as number | null
  });

  const handleToggleProgram = () => {
    createOrUpdateProgram({ isActive: !program?.isActive });
  };

  const handleSaveSettings = () => {
    createOrUpdateProgram({
      ...settings,
      isActive: program?.isActive ?? true
    });
    setIsSettingsOpen(false);
  };

  const handleCreateReward = () => {
    if (!newReward.name.trim()) return;
    
    createReward({
      name: newReward.name,
      description: newReward.description || null,
      pointsRequired: newReward.pointsRequired,
      rewardType: newReward.rewardType,
      rewardValue: newReward.rewardValue,
      isActive: true,
      maxRedemptions: newReward.maxRedemptions
    });
    
    setNewReward({
      name: '',
      description: '',
      pointsRequired: 100,
      rewardType: 'discount',
      rewardValue: 10,
      maxRedemptions: null
    });
    setIsRewardDialogOpen(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const totalPointsDistributed = customerPoints.reduce((sum, c) => sum + c.lifetimePoints, 0);
  const activeCustomers = customerPoints.filter(c => c.totalPoints > 0).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Programme de Fidélité</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={program?.isActive ?? false}
            onCheckedChange={handleToggleProgram}
          />
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Paramètres du Programme</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium">Points par achat</label>
                  <Input
                    type="number"
                    value={settings.pointsPerPurchase}
                    onChange={(e) => setSettings({ ...settings, pointsPerPurchase: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Points par ajout en favori</label>
                  <Input
                    type="number"
                    value={settings.pointsPerFavorite}
                    onChange={(e) => setSettings({ ...settings, pointsPerFavorite: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Points par interaction message</label>
                  <Input
                    type="number"
                    value={settings.pointsPerMessage}
                    onChange={(e) => setSettings({ ...settings, pointsPerMessage: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <Button onClick={handleSaveSettings} className="w-full">
                  Enregistrer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {!program?.isActive ? (
          <div className="text-center py-6 text-muted-foreground">
            <Gift className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Programme de fidélité désactivé</p>
            <p className="text-sm">Activez-le pour récompenser vos clients fidèles</p>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Aperçu</TabsTrigger>
              <TabsTrigger value="rewards">Récompenses</TabsTrigger>
              <TabsTrigger value="customers">Clients</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-600 mb-1">
                    <Coins className="h-4 w-4" />
                    <span className="text-sm font-medium">Points distribués</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-700">{totalPointsDistributed.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 text-green-600 mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">Clients actifs</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{activeCustomers}</p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Points gagnés par action
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Achat validé</span>
                    <Badge variant="secondary">{program.pointsPerPurchase} pts</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Ajout en favoris</span>
                    <Badge variant="secondary">{program.pointsPerFavorite} pts</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Interaction message</span>
                    <Badge variant="secondary">{program.pointsPerMessage} pts</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{rewards.length} récompense(s)</span>
                <Dialog open={isRewardDialogOpen} onOpenChange={setIsRewardDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nouvelle Récompense</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="text-sm font-medium">Nom</label>
                        <Input
                          placeholder="Ex: -10% sur votre prochain achat"
                          value={newReward.name}
                          onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          placeholder="Décrivez la récompense..."
                          value={newReward.description}
                          onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Type</label>
                          <Select
                            value={newReward.rewardType}
                            onValueChange={(value) => setNewReward({ ...newReward, rewardType: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="discount">Réduction</SelectItem>
                              <SelectItem value="gift">Cadeau</SelectItem>
                              <SelectItem value="vip">Statut VIP</SelectItem>
                              <SelectItem value="free_service">Service gratuit</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Valeur</label>
                          <Input
                            type="number"
                            value={newReward.rewardValue}
                            onChange={(e) => setNewReward({ ...newReward, rewardValue: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Points requis</label>
                        <Input
                          type="number"
                          value={newReward.pointsRequired}
                          onChange={(e) => setNewReward({ ...newReward, pointsRequired: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <Button onClick={handleCreateReward} className="w-full">
                        Créer la récompense
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {rewards.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Trophy className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune récompense créée</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rewards.map((reward) => (
                    <div
                      key={reward.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                          {rewardTypeIcons[reward.rewardType]}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{reward.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {reward.pointsRequired} pts
                            </Badge>
                            <span>{rewardTypeLabels[reward.rewardType]}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Switch
                          checked={reward.isActive}
                          onCheckedChange={(checked) => updateReward(reward.id, { isActive: checked })}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => deleteReward(reward.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="customers" className="space-y-4">
              {customerPoints.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucun client n'a encore de points</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {customerPoints.slice(0, 10).map((customer, index) => (
                    <div
                      key={customer.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">Client #{customer.customerId.slice(0, 8)}</p>
                          <p className="text-xs text-muted-foreground">
                            Total cumulé: {customer.lifetimePoints} pts
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        {customer.totalPoints} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
