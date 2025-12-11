import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRoadmapStore } from '@/hooks/useRoadmapStore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ChevronDown, Edit2, Save, Plus, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Resource } from '@/types/roadmap';

const Roadmap = () => {
  const { phases, days, toggleDayComplete, updateDayNotes, updateDay, addResource } = useRoadmapStore();
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<string | null>(null);

  const getDaysForPhase = (phaseId: string) => {
    return days.filter(d => d.phaseId === phaseId);
  };

  const getPhaseProgress = (phaseId: string) => {
    const phaseDays = getDaysForPhase(phaseId);
    const completed = phaseDays.filter(d => d.completed).length;
    return phaseDays.length > 0 ? Math.round((completed / phaseDays.length) * 100) : 0;
  };

  const [resourceDialog, setResourceDialog] = useState<{ open: boolean; dayId: string | null }>({ open: false, dayId: null });
  const [newResource, setNewResource] = useState({ title: '', content: '', type: 'link' as Resource['type'], category: 'general' as Resource['category'] });

  const handleAddResource = () => {
    if (resourceDialog.dayId && newResource.title) {
      addResource({
        ...newResource,
        dayId: resourceDialog.dayId,
      });
      setNewResource({ title: '', content: '', type: 'link', category: 'general' });
      setResourceDialog({ open: false, dayId: null });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-display font-bold mb-2">180-Day Roadmap</h1>
          <p className="text-muted-foreground">Track your cloud computing journey phase by phase</p>
        </div>

        <Accordion type="multiple" className="space-y-4">
          {phases.map((phase, index) => {
            const phaseDays = getDaysForPhase(phase.id);
            const progress = getPhaseProgress(phase.id);
            const completedCount = phaseDays.filter(d => d.completed).length;

            return (
              <AccordionItem 
                key={phase.id} 
                value={phase.id}
                className="glass-card border-none animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-display font-semibold">{phase.name}</h3>
                      <Badge variant={progress === 100 ? 'default' : 'secondary'}>
                        {completedCount}/{phaseDays.length}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{phase.description}</p>
                    <Progress value={progress} className="h-2" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 pt-2">
                    {phaseDays.map((day) => (
                      <div 
                        key={day.id}
                        className={cn(
                          "p-4 rounded-lg border transition-all",
                          day.completed ? "bg-success/5 border-success/20" : "bg-card border-border"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={day.completed}
                            onCheckedChange={() => toggleDayComplete(day.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-medium text-muted-foreground">Day {day.dayNumber}</span>
                              {editingDay === day.id ? (
                                <Input
                                  value={day.title}
                                  onChange={(e) => updateDay(day.id, { title: e.target.value })}
                                  className="h-7 text-sm flex-1"
                                />
                              ) : (
                                <span className={cn("font-medium", day.completed && "line-through text-muted-foreground")}>
                                  {day.title}
                                </span>
                              )}
                            </div>
                            
                            {/* Notes Section */}
                            {expandedNotes === day.id && (
                              <div className="mt-3">
                                <Textarea
                                  placeholder="Write what you learned today..."
                                  value={day.notes}
                                  onChange={(e) => updateDayNotes(day.id, e.target.value)}
                                  className="min-h-[80px] text-sm"
                                />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedNotes(expandedNotes === day.id ? null : day.id)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Dialog open={resourceDialog.open && resourceDialog.dayId === day.id} onOpenChange={(open) => setResourceDialog({ open, dayId: open ? day.id : null })}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add Resource for Day {day.dayNumber}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 pt-4">
                                  <Input
                                    placeholder="Resource title"
                                    value={newResource.title}
                                    onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                                  />
                                  <Select value={newResource.type} onValueChange={(v: Resource['type']) => setNewResource(prev => ({ ...prev, type: v }))}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="link">Link</SelectItem>
                                      <SelectItem value="video">Video</SelectItem>
                                      <SelectItem value="code">Code Snippet</SelectItem>
                                      <SelectItem value="summary">Summary</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Textarea
                                    placeholder="URL or content..."
                                    value={newResource.content}
                                    onChange={(e) => setNewResource(prev => ({ ...prev, content: e.target.value }))}
                                  />
                                  <Button onClick={handleAddResource} className="w-full">
                                    Add Resource
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </Layout>
  );
};

export default Roadmap;
