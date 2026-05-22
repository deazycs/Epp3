'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Download, Plus, ChevronUp, ChevronDown, Eye } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatusBadge, RiskBadge, PriorityBadge, OverdueBadge, Breadcrumbs } from '@/components/ui/index';
import { STATUS_LABELS } from '@/mock/data/procurements';
import { useAppStore } from '@/store/index';
import { formatCurrency, formatDate, truncate, PROCUREMENT_TYPE_LABELS } from '@/lib/utils';
import { exportProcurementsXLSX } from '@/lib/export';
import type { Procurement } from '@/types';



export default function ZakupkiPage() {
  const { procurements } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [deptFilter, setDeptFilter] = useState('');
  const [sortField, setSortField] = useState<keyof Procurement>('createdAt');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 10;

  const filtered = useMemo(() => {
    let d = [...procurements];
    if (search) {
      const q = search.toLowerCase();
      d = d.filter(p => p.registryNumber.toLowerCase().includes(q) || p.title.toLowerCase().includes(q) || (p.supplierName?.toLowerCase().includes(q)??false));
    }
    if (statusFilter.length > 0) d = d.filter(p => statusFilter.includes(p.status));
    if (deptFilter) d = d.filter(p => p.departmentId === deptFilter);
    d.sort((a,b) => {
      const av = String(a[sortField]??''), bv = String(b[sortField]??'');
      return sortDir==='asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return d;
  }, [procurements, search, statusFilter, deptFilter, sortField, sortDir]);

  const pages = Math.max(1, Math.ceil(filtered.length/pageSize));
  const paged = filtered.slice((page-1)*pageSize, page*pageSize);

  const toggleSort = (f: keyof Procurement) => { if(sortField===f) setSortDir(d=>d==='asc'?'desc':'asc'); else{setSortField(f);setSortDir('desc');} };
  const SortIcon = ({field}:{field:keyof Procurement}) => sortField===field ? (sortDir==='asc'?<ChevronUp size={10}/>:<ChevronDown size={10}/>) : <ChevronDown size={10} className="opacity-20"/>;

  const active = procurements.filter(p=>!['archive','cancelled'].includes(p.status)).length;
  const overdueCount = procurements.filter(p=>p.isOverdue).length;
  const totalSum = procurements.reduce((s,p)=>s+p.plannedSum,0);

  return (
    <AppLayout>
      <div className="p-3 sm:p-4">
        <Breadcrumbs items={[{label:'Рабочий стол',href:'/dashboard'},{label:'Реестр закупок'}]}/>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-base font-bold">Реестр закупок</h1>
            <p className="text-xs text-gray-500">Всего: {procurements.length} · Активных: {active} · Просрочено: {overdueCount}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>exportProcurementsXLSX(filtered)} className="gov-btn gov-btn-ghost gov-btn-sm hidden sm:flex">
              <Download size={12}/> Excel
            </button>
            <Link href="/zakupki/novaya" className="gov-btn gov-btn-primary gov-btn-sm">
              <Plus size={12}/> Создать
            </Link>
          </div>
        </div>

        {/* Мобильная статистика */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="gov-card p-2 text-center"><div className="text-lg font-bold text-gray-700">{procurements.length}</div><div className="text-xs text-gray-400">Всего</div></div>
          <div className="gov-card p-2 text-center"><div className={`text-lg font-bold ${overdueCount>0?'text-red-600':'text-gray-500'}`}>{overdueCount}</div><div className="text-xs text-gray-400">Просрочено</div></div>
          <div className="gov-card p-2 text-center"><div className="text-lg font-bold text-blue-700 text-sm">{formatCurrency(totalSum)}</div><div className="text-xs text-gray-400">Сумма</div></div>
        </div>

        {/* Фильтры */}
        <div className="gov-card mb-3">
          <div className="p-2 flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-40">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input className="gov-input pl-7" placeholder="Поиск..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
            </div>
            <select className="gov-select w-36" value={deptFilter} onChange={e=>{setDeptFilter(e.target.value);setPage(1);}}>
              <option value="">Все подразделения</option>
              <option value="d1">Отдел МТО</option>
              <option value="d4">ИТ-отдел</option>
              <option value="d5">АХО</option>
            </select>
            <button onClick={()=>setShowFilters(f=>!f)}
              className={`gov-btn gov-btn-sm ${showFilters||statusFilter.length>0?'gov-btn-primary':'gov-btn-ghost'}`}>
              Статусы {statusFilter.length>0&&`(${statusFilter.length})`}
            </button>
            {(search||statusFilter.length>0||deptFilter) && (
              <button onClick={()=>{setSearch('');setStatusFilter([]);setDeptFilter('');setPage(1);}} className="gov-btn gov-btn-ghost gov-btn-sm text-red-600">✕</button>
            )}
          </div>
          {showFilters && (
            <div className="px-3 pb-3 border-t pt-2">
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(STATUS_LABELS).map(([key,label])=>(
                  <button key={key} onClick={()=>{setStatusFilter(sf=>sf.includes(key)?sf.filter(s=>s!==key):[...sf,key]);setPage(1);}}
                    className={`text-xs px-2 py-0.5 border rounded cursor-pointer ${statusFilter.includes(key)?'bg-blue-600 text-white border-blue-600':'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop таблица */}
        <div className="hidden sm:block gov-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="gov-table">
              <thead>
                <tr>
                  <th className="w-8"><input type="checkbox" onChange={()=>setSelected(s=>s.length===paged.length?[]:paged.map(p=>p.id))} checked={selected.length===paged.length&&paged.length>0}/></th>
                  <th className="cursor-pointer" onClick={()=>toggleSort('registryNumber')}><span className="flex items-center gap-1">Номер <SortIcon field="registryNumber"/></span></th>
                  <th>Наименование</th>
                  <th className="cursor-pointer" onClick={()=>toggleSort('status')}><span className="flex items-center gap-1">Статус <SortIcon field="status"/></span></th>
                  <th>Тип</th>
                  <th className="cursor-pointer text-right" onClick={()=>toggleSort('plannedSum')}><span className="flex items-center gap-1 justify-end">Сумма <SortIcon field="plannedSum"/></span></th>
                  <th>Поставщик</th>
                  <th>Риск</th>
                  <th className="cursor-pointer" onClick={()=>toggleSort('plannedEndDate')}><span className="flex items-center gap-1">Срок <SortIcon field="plannedEndDate"/></span></th>
                  <th>Ответственный</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {paged.map(p=>(
                  <tr key={p.id} className={selected.includes(p.id)?'selected':''}>
                    <td className="text-center"><input type="checkbox" checked={selected.includes(p.id)} onChange={()=>setSelected(s=>s.includes(p.id)?s.filter(x=>x!==p.id):[...s,p.id])}/></td>
                    <td><Link href={`/zakupki/${p.id}`} className="text-blue-600 hover:underline font-bold text-xs">{p.registryNumber}</Link>{p.eatNumber&&<div className="text-xs text-gray-400">{p.eatNumber}</div>}</td>
                    <td><Link href={`/zakupki/${p.id}`} className="text-xs hover:text-blue-600">{truncate(p.title,45)}</Link><div className="text-xs text-gray-400">{p.departmentName}</div></td>
                    <td><StatusBadge status={p.status}/></td>
                    <td className="text-xs text-gray-500">{PROCUREMENT_TYPE_LABELS[p.procurementType]}</td>
                    <td className="text-xs font-bold text-right whitespace-nowrap">{formatCurrency(p.plannedSum)}</td>
                    <td>{p.supplierName?<div><div className="text-xs font-bold">{truncate(p.supplierName,18)}</div><div className="text-xs text-gray-400">{p.supplierInn}</div></div>:<span className="text-gray-400 text-xs">—</span>}</td>
                    <td><RiskBadge level={p.riskLevel}/></td>
                    <td className="text-xs">{p.isOverdue?<OverdueBadge days={p.overduedays}/>:<span className="text-gray-500">{formatDate(p.plannedEndDate)}</span>}</td>
                    <td className="text-xs font-bold">{p.responsibleName}</td>
                    <td><Link href={`/zakupki/${p.id}`} className="p-1 text-gray-400 hover:text-blue-600 block"><Eye size={12}/></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-3 py-2 border-t bg-gray-50">
            <div className="text-xs text-gray-500">Показано {(page-1)*pageSize+1}–{Math.min(page*pageSize,filtered.length)} из {filtered.length}</div>
            <div className="flex items-center gap-1">
              <button className="gov-btn gov-btn-ghost gov-btn-sm" disabled={page===1} onClick={()=>setPage(p=>p-1)}>←</button>
              {Array.from({length:Math.min(pages,5)},(_,i)=>i+1).map(p=>(
                <button key={p} onClick={()=>setPage(p)} className={`w-6 h-6 text-xs rounded font-bold ${p===page?'bg-blue-600 text-white':'text-gray-600 hover:bg-gray-200'}`}>{p}</button>
              ))}
              <button className="gov-btn gov-btn-ghost gov-btn-sm" disabled={page===pages} onClick={()=>setPage(p=>p+1)}>→</button>
            </div>
          </div>
        </div>

        {/* Mobile карточки */}
        <div className="sm:hidden space-y-2">
          {paged.map(p=>(
            <Link key={p.id} href={`/zakupki/${p.id}`} className="gov-card p-3 block hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="text-xs font-bold text-blue-600">{p.registryNumber}</div>
                  <div className="text-xs text-gray-700 mt-0.5 leading-tight">{truncate(p.title,55)}</div>
                </div>
                <StatusBadge status={p.status}/>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{p.departmentName}</span>
                <span className="font-bold text-gray-800">{formatCurrency(p.plannedSum)}</span>
              </div>
              {p.isOverdue && <div className="mt-1"><OverdueBadge days={p.overduedays}/></div>}
            </Link>
          ))}
          <div className="flex justify-center gap-2 pt-2">
            <button className="gov-btn gov-btn-ghost gov-btn-sm" disabled={page===1} onClick={()=>setPage(p=>p-1)}>← Назад</button>
            <span className="text-xs text-gray-500 py-1">{page} / {pages}</span>
            <button className="gov-btn gov-btn-ghost gov-btn-sm" disabled={page===pages} onClick={()=>setPage(p=>p+1)}>Далее →</button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
