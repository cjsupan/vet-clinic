import Head from 'next/head';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const Header = dynamic(()=> import('../layout/Header')); 
const Sidebar = dynamic(()=> import('../layout/Sidebar'));
function Layout({children}){
    const [Open, setOpen] = useState(false);
    function onClick(){
      setOpen(!Open);
    }
    return (
      <>
      <Head>
				<title>Vet Clinic</title>
			</Head>
      <div className='flex flex-row w-full h-screen bg-bg'>
        <Sidebar onClick={onClick} Open={Open}></Sidebar>
        <div className='flex flex-col w-full'>
        <Header Open={Open}></Header>
          <div className='p-8 w-full h-full'>
            {children}
          </div>
        </div>
      </div>
      </>  
    )
}
export default Layout;