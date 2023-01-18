import Link from "next/link";
import {Users, User, Database, Calendar, Grid, Menu} from 'react-feather';
function Sidebar({onClick, Open}){
  const menuItems = [
    {
      href: '/',
      title: 'Dashboard',
      icon: <Grid className="w-6"/>
    },
    {
      href: '/',
      title: 'Users',
      icon: <User className="w-6"/>
    },
    {
      href: '/clients',
      title: 'Clients',
      icon: <Users className="w-6"/>
    },
    {
      href: '/',
      title: 'Appointment',
      icon: <Calendar className="w-6"/>
    },
    {
      href: '/',
      title: 'Backup/Restore',
      icon: <Database className="w-6"/>
    },
  ];
  return (
    <div className={`flex flex-col bg-white ${Open ? 'w-60' : ' w-16'} duration-300 overflow-hidden shadow-lg pt-8`}>
      <Menu className={`w-8 mb-4 transform duration-300 self-end mx-4 shadow-lg border-1 border-black ${Open && 'origin-center -rotate-90'}`} onClick={onClick}/>
        {menuItems.map(({href, title, icon}) => 

          <Link href={href} key={title} className={`h-10 pl-4 hover:bg-gray-200`}>
            <div className={`absolute flex flex-row pt-2 space-x-2 font-medium `}>
              {icon}<h1 className={`origin-left transform duration-300 ${!Open && "scale-x-0"}`}>{Open ? title : null}</h1>
            </div>
          </Link>
        )}
    </div>
  )
}

export default Sidebar;