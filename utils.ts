'use client';
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Breadcrumbs } from '@/components/ui/index';
import { MOCK_USERS } from '@/mock/data/users';
import { Send } from 'lucide-react';

const CHATS=[
  {id:'c1',name:'Общий МТО',type:'group',last:'Петров А.В.: Картриджи придут в пятницу',time:'10:30',unread:2},
  {id:'c2',name:'Смирнова Н.С.',type:'direct',last:'Наталья Сергеевна: Пришлите ТЗ на согласование',time:'09:15',unread:1},
  {id:'c3',name:'Козлов Д.М.',type:'direct',last:'Договор подписан, оригинал у меня',time:'Вчера',unread:0},
  {id:'c4',name:'Закупка РЗ-2026-00089',type:'group',last:'Никитин П.А.: Запросил КП у трёх поставщиков',time:'Вчера',unread:0},
];
const MSGS=[
  {id:'m1',from:'Смирнова Н.С.',text:'Андрей Викторович, пришлите ТЗ на картриджи на согласование.',time:'09:15',mine:false},
  {id:'m2',from:'Петров А.В.',text:'Наталья Сергеевна, направил на почту. Также прикрепил в карточке закупки РЗ-2026-00142.',time:'09:22',mine:true},
  {id:'m3',from:'Смирнова Н.С.',text:'Получила, посмотрю до обеда.',time:'09:23',mine:false},
];

export default function ChatPage() {
  const [active,setActive]=useState('c2');
  const [msg,setMsg]=useState('');
  const chat=CHATS.find(c=>c.id===active);
  return (
    <AppLayout>
      <div className="p-4">
        <Breadcrumbs items={[{label:'Рабочий стол',href:'/dashboard'},{label:'Внутренний чат'}]}/>
        <h1 className="text-base font-bold mb-3">Внутренний чат</h1>
        <div className="gov-card overflow-hidden flex" style={{height:'520px'}}>
          {/* Список чатов */}
          <div className="w-56 flex-shrink-0 border-r border-gray-200 overflow-y-auto">
            {CHATS.map(c=>(
              <button key={c.id} onClick={()=>setActive(c.id)}
                className={`w-full text-left px-3 py-2.5 border-b border-gray-100 hover:bg-gray-50 transition-colors ${active===c.id?'bg-blue-50 border-l-2 border-l-blue-600':''}`}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold text-gray-800 truncate">{c.name}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-1">{c.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 truncate">{c.last}</span>
                  {c.unread>0&&<span className="w-4 h-4 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center flex-shrink-0 ml-1">{c.unread}</span>}
                </div>
              </button>
            ))}
          </div>
          {/* Область переписки */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="px-4 py-2 border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="text-xs font-bold text-gray-800">{chat?.name}</div>
              <div className="text-xs text-gray-400">{chat?.type==='group'?'Групповой чат':'Личный чат'}</div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {MSGS.map(m=>(
                <div key={m.id} className={`flex ${m.mine?'justify-end':''}`}>
                  <div className={`max-w-xs rounded-lg px-3 py-2 ${m.mine?'bg-blue-600 text-white':'bg-gray-100 text-gray-800'}`}>
                    {!m.mine&&<div className="text-xs font-bold mb-0.5 text-blue-600">{m.from}</div>}
                    <div className="text-xs">{m.text}</div>
                    <div className={`text-xs mt-1 ${m.mine?'text-blue-200':'text-gray-400'}`}>{m.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-200 flex gap-2 flex-shrink-0">
              <input className="gov-input flex-1" placeholder="Введите сообщение..." value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')setMsg('');}}/>
              <button onClick={()=>setMsg('')} className="gov-btn gov-btn-primary gov-btn-sm"><Send size={12}/></button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
