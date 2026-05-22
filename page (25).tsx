'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AppLayout } from '@/components/layout/AppLayout';
import { Breadcrumbs } from '@/components/ui/index';
import { ANALYTICS_MONTHLY, ANALYTICS_BY_DEPARTMENT } from '@/mock/data/other';
import { formatCurrency } from '@/lib/utils';
import { Download, FileText, BarChart3 } from 'lucide-react';

const REPORT_TEMPLATES = [
  { id: 'r1', name: 'Сводный отчёт о закупках', period: 'II квартал 2025', format: 'XLSX', size: '245 КБ', ready: true },
  { id: 'r2', name: 'Отчёт об исполнении бюджета', period: 'Январь–Май 2025', format: 'XLSX', size: '189 КБ', ready: true },
  { id: 'r3', name: 'Реестр действующих договоров', period: 'Текущие', format: 'XLSX', size: '112 КБ', ready: true },
  { id: 'r4', name: 'Анализ просрочек и рисков', period: 'II квартал 2025', format: 'PDF', size: '—', ready: false },
  { id: 'r5', name: 'Статистика поставщиков', period: '2025 год', format: 'XLSX', size: '98 КБ', ready: true },
  { id: 'r6', name: 'Отчёт о выполнении KPI МТО', period: 'Май 2025', format: 'PDF', size: '—', ready: false },
];

export default function OtchetnostPage() {
  return (
    <AppLayout>
      <div className="p-4">
        <Breadcrumbs items={[{ label: 'Рабочий стол', href: '/dashboard' }, { label: 'Отчётность' }]} />
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-base font-bold">Внутренняя отчётность</h1>
          <div className="flex gap-2">
            <select className="gov-select w-40">
              <option>II квартал 2025</option>
              <option>I квартал 2025</option>
              <option>2025 год</option>
            </select>
            <button className="gov-btn gov-btn-primary gov-btn-sm"><BarChart3 size={12} /> Сформировать</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2 gov-card">
            <div className="gov-section-title">📊 Динамика закупок по месяцам</div>
            <div className="p-3">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ANALYTICS_MONTHLY}>
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v/1000).toFixed(0)}к`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ fontSize: 11 }} />
                  <Bar dataKey="sum" fill="#003087" name="Сумма" radius={[2,2,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="gov-card">
            <div className="gov-section-title">📋 Ключевые показатели</div>
            <div className="p-3 space-y-3">
              {[
                { label: 'Всего закупок', val: '47', note: 'за 2025 год' },
                { label: 'Общая плановая сумма', val: '5 374 500 ₽', note: '' },
                { label: 'Заключено договоров', val: '38', note: '81% от плана' },
                { label: 'Экономия бюджета', val: '127 300 ₽', note: '2.4%' },
                { label: 'Среднее время согл.', val: '4.2 дн.', note: '' },
                { label: 'Просрочено (текущих)', val: '1', note: 'требует внимания' },
              ].map(k => (
                <div key={k.label} className="flex justify-between items-baseline border-b border-gray-100 pb-1">
                  <span className="text-xs text-gray-500">{k.label}</span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-800">{k.val}</span>
                    {k.note && <div className="text-xs text-gray-400">{k.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Готовые отчёты */}
        <div className="gov-card">
          <div className="gov-section-title">📁 Сформированные отчёты</div>
          <table className="gov-table">
            <thead>
              <tr>
                <th>Наименование отчёта</th>
                <th>Период</th>
                <th>Формат</th>
                <th>Размер</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {REPORT_TEMPLATES.map(r => (
                <tr key={r.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <FileText size={12} className="text-blue-500 flex-shrink-0" />
                      <span className="text-xs font-bold">{r.name}</span>
                    </div>
                  </td>
                  <td className="text-xs text-gray-600">{r.period}</td>
                  <td>
                    <span className={`gov-badge ${r.format === 'PDF' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                      {r.format}
                    </span>
                  </td>
                  <td className="text-xs text-gray-500">{r.size}</td>
                  <td>
                    <span className={`gov-badge ${r.ready ? 'bg-green-50 text-green-700 border-green-300' : 'bg-yellow-50 text-yellow-700 border-yellow-300'}`}>
                      {r.ready ? '✓ Готов' : '⏳ Формируется'}
                    </span>
                  </td>
                  <td>
                    {r.ready ? (
                      <button className="gov-btn gov-btn-ghost gov-btn-sm"><Download size={11} /> Скачать</button>
                    ) : (
                      <button className="gov-btn gov-btn-secondary gov-btn-sm">Запустить</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
