
import React, { useState, useMemo } from 'react';
import { useLogistica, LogisticaItem } from '@/hooks/useLogistica';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Circle,
  ChevronRight,
  Search,
  Truck,
  Utensils,
  Phone,
  Backpack,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('transporte')) return <Truck className="w-5 h-5" />;
  if (cat.includes('aliment')) return <Utensils className="w-5 h-5" />;
  if (cat.includes('call center')) return <Phone className="w-5 h-5" />;
  if (cat.includes('pedagog')) return <Backpack className="w-5 h-5" />;
  return <Users className="w-5 h-5" />;
};

const LogisticaModule = () => {
  const { items, loading, updateItem } = useLogistica();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<LogisticaItem>>({});

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.nombre_manual.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const groups = useMemo(() => {
    const grouped: Record<string, LogisticaItem[]> = {};
    filteredItems.forEach(item => {
      if (!grouped[item.categoria]) grouped[item.categoria] = [];
      grouped[item.categoria].push(item);
    });
    return grouped;
  }, [filteredItems]);

  const handleEdit = (item: LogisticaItem) => {
    setEditingId(item.id);
    setEditValues({
      horario_inicio: item.horario_inicio || '',
      horario_fin: item.horario_fin || '',
      rol: item.rol || '',
      zona: item.zona || ''
    });
  };

  const handleSave = async (id: string) => {
    await updateItem(id, editValues);
    setEditingId(null);
    toast.success('Horario actualizado');
  };

  if (loading) return <div className="p-8 text-center">Cargando logística...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Panel de Logística</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Organización de equipos y turnos</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Buscar por nombre o categoría..." 
            className="pl-10 bg-white/50 backdrop-blur-sm border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groups).map(([category, people]) => {
          if (category === 'APOYO ELECTORAL') {
            const subGroups = people.reduce((acc, p) => {
              const zone = p.zona || 'OTROS';
              if (!acc[zone]) acc[zone] = [];
              acc[zone].push(p);
              return acc;
            }, {} as Record<string, LogisticaItem[]>);

            return (
              <Card key={category} className="md:col-span-2 lg:col-span-3 overflow-hidden border-none shadow-2xl bg-white dark:bg-slate-900">
                <CardHeader className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    <CardTitle className="text-xl font-bold uppercase tracking-wider">APOYO ELECTORAL</CardTitle>
                    <span className="ml-auto bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                      {people.length} EQUIPO TOTAL
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex flex-col md:flex-row">
                  {/* Etiqueta lateral vertical */}
                  <div className="bg-slate-100 dark:bg-slate-800 py-8 px-2 flex items-center justify-center border-r border-slate-200 dark:border-slate-700">
                    <span className="[writing-mode:vertical-lr] rotate-180 font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase whitespace-nowrap text-sm">
                      LUIS ARROYAVE Y SUGGEIN
                    </span>
                  </div>

                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-x divide-slate-100 dark:divide-slate-800">
                    {['TESTIGOS', 'JURADOS'].map(zone => (
                      <div key={zone} className="flex flex-col">
                        <div className="bg-sky-500 text-white py-2 px-4 font-bold text-center tracking-widest uppercase text-sm">
                          {zone}
                        </div>
                        <div className="divide-y divide-slate-50 dark:divide-slate-800 flex-1">
                          {(subGroups[zone] || []).sort((a, b) => {
                            if (a.rol === 'COORDINADOR') return -1;
                            if (b.rol === 'COORDINADOR') return 1;
                            if (a.rol === 'REMANENTE') return -1;
                            if (b.rol === 'REMANENTE') return 1;
                            return 0;
                          }).map(person => (
                            <div key={person.id} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                              <div className="flex flex-col">
                                <span className={`font-bold text-sm ${person.completado ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                  {person.rol ? (
                                    <span className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] mr-2 text-slate-600 dark:text-slate-400">{person.rol}</span>
                                  ) : null}
                                  {person.nombre_manual}
                                </span>
                                {(person.horario_inicio || person.horario_fin) && (
                                  <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                    <Clock className="w-3 h-3" /> {person.horario_inicio || '?'} - {person.horario_fin || '?'}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => handleEdit(person)}>
                                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                                </Button>
                                <Checkbox 
                                  checked={person.completado} 
                                  onCheckedChange={(checked) => updateItem(person.id, { completado: !!checked })}
                                  className="w-4 h-4 border-slate-300"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          }

          return (
            <Card key={category} className="overflow-hidden border-none shadow-xl bg-white/70 backdrop-blur-md dark:bg-slate-900/40">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-5">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(category)}
                  <CardTitle className="text-lg font-bold truncate">
                    {category === 'CALL CENTER' ? 'CALL CENTER (TODOS)' : category}
                  </CardTitle>
                  <span className="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-xs font-medium">
                    {people.length}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {people.map(person => (
                    <div key={person.id} className={`p-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50 ${person.completado ? 'opacity-70' : ''}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold text-slate-900 dark:text-slate-100 ${person.completado ? 'line-through' : ''}`}>
                              {person.nombre_manual}
                            </span>
                            {person.voter_id && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded-md font-medium uppercase">
                                Base Datos
                              </span>
                            )}
                          </div>
  
                          {editingId === person.id ? (
                            <div className="mt-3 space-y-3 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Inicio</label>
                                  <Input 
                                    size={1}
                                    placeholder="08:00"
                                    className="h-8 text-xs"
                                    value={editValues.horario_inicio || ''}
                                    onChange={e => setEditValues(prev => ({ ...prev, horario_inicio: e.target.value }))}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Fin</label>
                                  <Input 
                                    placeholder="17:00"
                                    className="h-8 text-xs"
                                    value={editValues.horario_fin || ''}
                                    onChange={e => setEditValues(prev => ({ ...prev, horario_fin: e.target.value }))}
                                  />
                                </div>
                              </div>
                              <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Rol/Misión</label>
                                  <Input 
                                    placeholder="Ej: Mesa 5"
                                    className="h-8 text-xs"
                                    value={editValues.rol || ''}
                                    onChange={e => setEditValues(prev => ({ ...prev, rol: e.target.value }))}
                                  />
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" className="h-7 text-[11px] flex-1" onClick={() => handleSave(person.id)}>
                                  <Save className="w-3 h-3 mr-1" /> Guardar
                                </Button>
                                <Button size="sm" variant="outline" className="h-7 text-[11px] flex-1" onClick={() => setEditingId(null)}>
                                  <X className="w-3 h-3 mr-1" /> Cancelar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Clock className="w-3.5 h-3.5" />
                                <span>
                                  {person.horario_inicio || person.horario_fin ? 
                                    `${person.horario_inicio || '?'} - ${person.horario_fin || '?'}` : 
                                    'Sin horario'}
                                </span>
                              </div>
                              {person.rol && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                  <Users className="w-3.5 h-3.5" />
                                  <span>{person.rol}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
  
                        <div className="flex flex-col items-end gap-2">
                           <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                                onClick={() => handleEdit(person)}
                              >
                                <Edit2 className="w-4 h-4 text-slate-400" />
                              </Button>
                              
                              <Checkbox 
                                checked={person.completado} 
                                onCheckedChange={(checked) => updateItem(person.id, { completado: !!checked })}
                                className="w-5 h-5 border-2 border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                              />
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="text-center py-20">
          <Circle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No se encontraron resultados</h3>
          <p className="text-slate-500">Intenta con otros términos de búsqueda.</p>
        </div>
      )}
    </div>
  );
};

export default LogisticaModule;
