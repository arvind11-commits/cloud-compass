import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useRoadmapStore } from '@/hooks/useRoadmapStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Link as LinkIcon, Video, FileText, Code, BookOpen, Trash2, ExternalLink, Search } from 'lucide-react';
import { Resource } from '@/types/roadmap';
import { cn } from '@/lib/utils';

const categories: { id: Resource['category']; label: string }[] = [
  { id: 'linux', label: 'Linux' },
  { id: 'networking', label: 'Networking' },
  { id: 'aws', label: 'AWS' },
  { id: 'devops', label: 'DevOps' },
  { id: 'projects', label: 'Projects' },
  { id: 'general', label: 'General' },
];

const typeIcons: Record<Resource['type'], typeof LinkIcon> = {
  link: LinkIcon,
  video: Video,
  pdf: FileText,
  code: Code,
  summary: BookOpen,
};

const Resources = () => {
  const { resources, addResource, deleteResource } = useRoadmapStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<Resource['type'] | 'all'>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newResource, setNewResource] = useState<Omit<Resource, 'id' | 'createdAt'>>({
    title: '',
    content: '',
    type: 'link',
    category: 'general',
  });

  const handleAddResource = () => {
    if (newResource.title && newResource.content) {
      addResource(newResource);
      setNewResource({ title: '', content: '', type: 'link', category: 'general' });
      setDialogOpen(false);
    }
  };

  const filteredResources = (category: Resource['category']) => {
    return resources
      .filter(r => r.category === category)
      .filter(r => typeFilter === 'all' || r.type === typeFilter)
      .filter(r => 
        searchQuery === '' || 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Resources</h1>
            <p className="text-muted-foreground">Your learning library organized by topic</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Resource</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Resource title"
                  value={newResource.title}
                  onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select 
                    value={newResource.category} 
                    onValueChange={(v: Resource['category']) => setNewResource(prev => ({ ...prev, category: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select 
                    value={newResource.type} 
                    onValueChange={(v: Resource['type']) => setNewResource(prev => ({ ...prev, type: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="link">Link</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="pdf">PDF Note</SelectItem>
                      <SelectItem value="code">Code Snippet</SelectItem>
                      <SelectItem value="summary">Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  placeholder={newResource.type === 'code' ? 'Paste your code here...' : 'URL or content...'}
                  value={newResource.content}
                  onChange={(e) => setNewResource(prev => ({ ...prev, content: e.target.value }))}
                  className={newResource.type === 'code' ? 'font-mono text-sm' : ''}
                  rows={newResource.type === 'code' || newResource.type === 'summary' ? 8 : 3}
                />
                <Button onClick={handleAddResource} className="w-full">
                  Add Resource
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as Resource['type'] | 'all')}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="link">Links</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="pdf">PDFs</SelectItem>
              <SelectItem value="code">Code</SelectItem>
              <SelectItem value="summary">Summaries</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="linux" className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <TabsList className="w-full justify-start overflow-x-auto">
            {categories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id} className="gap-2">
                {cat.label}
                <Badge variant="secondary" className="text-xs">
                  {resources.filter(r => r.category === cat.id).length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(cat => (
            <TabsContent key={cat.id} value={cat.id} className="mt-6">
              <div className="grid gap-4">
                {filteredResources(cat.id).length === 0 ? (
                  <div className="glass-card p-8 text-center">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No resources yet in {cat.label}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setNewResource(prev => ({ ...prev, category: cat.id }));
                        setDialogOpen(true);
                      }}
                    >
                      Add your first resource
                    </Button>
                  </div>
                ) : (
                  filteredResources(cat.id).map(resource => {
                    const Icon = typeIcons[resource.type];
                    return (
                      <div key={resource.id} className="glass-card p-4 hover-lift">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium truncate">{resource.title}</h3>
                              <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                            </div>
                            {resource.type === 'code' ? (
                              <pre className="text-sm bg-secondary p-3 rounded-lg overflow-x-auto font-mono mt-2">
                                {resource.content}
                              </pre>
                            ) : resource.type === 'summary' ? (
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{resource.content}</p>
                            ) : (
                              <a 
                                href={resource.content} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline flex items-center gap-1"
                              >
                                {resource.content.length > 50 ? resource.content.slice(0, 50) + '...' : resource.content}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteResource(resource.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Resources;
