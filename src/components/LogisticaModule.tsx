
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
                <CardHeader className="bg-gradient-to-br from-blue-700 via-indigo-800 to-indigo-950 text-white p-4 md:p-6 border-b border-white/5">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl border border-white/10 shadow-inner">
                          <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-200" />
                        </div>
                        <CardTitle className="text-lg md:text-2xl font-black tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                          APOYO ELECTORAL
                        </CardTitle>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 flex flex-col items-center">
                        <span className="text-[10px] md:text-xs font-medium text-blue-200 uppercase tracking-tighter leading-none">Equipo</span>
                        <span className="text-sm md:text-lg font-black leading-none">{people.length}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 px-4 py-2 rounded-xl text-[11px] md:text-sm font-black shadow-xl shadow-amber-950/20 ring-1 ring-amber-300 animate-in fade-in zoom-in-95 duration-500">
                      <div className="bg-amber-950/20 p-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                        <span className="opacity-70 text-[9px] md:text-[10px] uppercase tracking-widest leading-none">COORDINADORES GENERALES</span>
                        <span className="tracking-tight leading-none md:mt-0">LUIS ARROYAVE Y SUGGEIN</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex-1 flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
                    {/* Listado de Personal por Zona */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
                      {['TESTIGOS', 'JURADOS'].map(zone => (
                        <div key={zone} className="flex flex-col">
                          <div className="bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800/50 py-2.5 px-4 font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase text-[10px] flex items-center gap-2">
                            <span className="w-1 h-3 bg-blue-500 rounded-full" />
                            {zone}
                          </div>
                          <div className="divide-y divide-slate-50 dark:divide-slate-800 flex-1">
                            {(subGroups[zone] || []).sort((a, b) => {
                              const priority = (name: string) => {
                                if (name.toUpperCase().includes('CARLOS RIVERA')) return 1;
                                if (name.toUpperCase().includes('JULIANA ARIAS')) return 2;
                                return 100;
                              };
                              return priority(a.nombre_manual || '') - priority(b.nombre_manual || '');
                            }).map(person => {
                              const isSpecial = person.nombre_manual?.toUpperCase().includes('CARLOS RIVERA') || person.nombre_manual?.toUpperCase().includes('JULIANA ARIAS');
                              return (
                                <div key={person.id} className={`p-4 flex items-center justify-between transition-all duration-300 ${isSpecial ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-l-2 border-indigo-500 mt-px mb-px shadow-sm' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'}`}>
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      {person.rol && (
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${isSpecial ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                                          {person.rol}
                                        </span>
                                      )}
                                      <span className={`font-bold text-sm md:text-base ${person.completado ? 'line-through text-slate-400' : isSpecial ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-200'}`}>
                                        {person.nombre_manual}
                                      </span>
                                    </div>
                                    {(person.horario_inicio || person.horario_fin) && (
                                      <span className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1 font-medium italic">
                                        <Clock className="w-3.5 h-3.5 text-blue-400" /> {person.horario_inicio || '00:00'} - {person.horario_fin || '00:00'}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-white dark:hover:bg-slate-800 shadow-sm md:shadow-none" onClick={() => handleEdit(person)}>
                                      <Edit2 className="w-4 h-4 text-slate-400 hover:text-blue-500 transition-colors" />
                                    </Button>
                                    <Checkbox 
                                      checked={person.completado} 
                                      onCheckedChange={(checked) => updateItem(person.id, { completado: !!checked })}
                                      className="w-5 h-5 md:w-6 md:h-6 rounded-md border-2 border-slate-200 dark:border-slate-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-all duration-300 scale-110 md:scale-100"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
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
