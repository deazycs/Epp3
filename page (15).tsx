'use client';
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Breadcrumbs } from '@/components/ui/index';
import { Save } from 'lucide-react';
export default function NastroykiPage() {
  const [saved,setSaved]=useState(false);
  return (
    <AppLayout>
      <div className="p-4">
        <Breadcrumbs items={[{label:'Рабочий стол',href:'/dashboard'},{label:'Настройки'}]}/>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-base font-bold">Настройки системы</h1>
          <button onClick={()=>setSaved(true)} className="gov-btn gov-btn-primary gov-btn-sm"><Save size={12}/> Сохранить</button>
        </div>
        {saved&&<div className="gov-alert gov-alert-success mb-3"><span>✓</span><span>Настройки сохранены.</span></div>}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="gov-card">
            <div className="gov-section-title">🔔 Уведомления</div>
            <div className="p-4 space-y-3">
              {[
                {label:'Предупреждение о сроках (дней до)',desc:'За сколько дней до дедлайна предупреждать',type:'number',val:'3'},
                {label:'Email-рассылка',desc:'Отправлять уведомления на рабочую почту',type:'checkbox',val:true},
                {label:'Ежедневный дайджест',desc:'Краткая сводка задач и дедлайнов в 09:00',type:'checkbox',val:true},
                {label:'Уведомления о согласованиях',desc:'При новых запросах на согласование',type:'checkbox',val:true},
              ].map(s=>(
                <div key={s.label} className="flex items-center justify-between">
                  <div><div className="text-xs font-bold">{s.label}</div><div className="text-xs text-gray-400">{s.desc}</div></div>
                  {s.type==='checkbox'?<input type="checkbox" defaultChecked={s.val as boolean} className="w-4 h-4"/>:<input type="number" className="gov-input w-20 text-right" defaultValue={s.val as string}/>}
                </div>
              ))}
            </div>
          </div>
          <div className="gov-card">
            <div className="gov-section-title">🖥 Интерфейс</div>
            <div className="p-4 space-y-3">
              {[
                {label:'Строк на странице таблицы',type:'select',opts:['10','15','20','50'],val:'15'},
                {label:'Часовой пояс',type:'select',opts:['Europe/Moscow (UTC+3)'],val:'Europe/Moscow'},
              ].map(s=>(
                <div key={s.label} className="flex items-center justify-between">
                  <div className="text-xs font-bold">{s.label}</div>
                  <select className="gov-select w-44">{s.opts.map(o=><option key={o}>{o}</option>)}</select>
                </div>
              ))}
              <div className="flex items-center justify-between"><div className="text-xs font-bold">Показывать подсказки</div><input type="checkbox" defaultChecked className="w-4 h-4"/></div>
              <div className="flex items-center justify-between"><div className="text-xs font-bold">Компактный режим таблиц</div><input type="checkbox" className="w-4 h-4"/></div>
            </div>
          </div>
          <div className="gov-card">
            <div className="gov-section-title">🔒 Смена пароля</div>
            <div className="p-4 space-y-3">
              <div><label className="gov-label">Текущий пароль</label><input type="password" className="gov-input" placeholder="••••••••"/></div>
              <div><label className="gov-label">Новый пароль</label><input type="password" className="gov-input" placeholder="Минимум 8 символов"/></div>
              <div><label className="gov-label">Подтверждение</label><input type="password" className="gov-input" placeholder="Повторите пароль"/></div>
              <button className="gov-btn gov-btn-secondary gov-btn-sm">Сменить пароль</button>
            </div>
          </div>
          <div className="gov-card">
            <div className="gov-section-title">ℹ О системе</div>
            <div className="p-4 space-y-1.5">
              {[['Система','Портал закупок Росреестра'],['Версия','3.0.0 (demo)'],['Платформы','ЕИС · ЕАТ «Берёзка» · СМЭВ'],['Среда','Демонстрационный режим'],['Дата сборки','20.05.2026']].map(r=>(
                <div key={r[0]} className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="text-xs text-gray-500">{r[0]}</span>
                  <span className="text-xs font-bold text-gray-700">{r[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
