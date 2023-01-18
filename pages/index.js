import Head from "next/head";
import Link from "next/link";
const Home = ()=> {
  let Cards = [
    {
      title: 'Clients',
      href: '/clients',
      value: 12,
      color: 'bg-cyan-500'
    },
    {
      title: 'Users',
      href: '/',
      value: 20,
      color: 'bg-rose-500'
    },
    {
      title: 'Appointments',
      href: '/',
      value: 5,
      color: 'bg-amber-400'
    },
  ]; 
  return (
    <>
    <Head>
      <title>Dashboard</title>
    </Head>
    <h1>
        <div className="flex flex-wrap space-x-6 w-full ">
          {Cards.map(({title, href, value, color})=>
          <Link href={href} key={title}>
            <div className={`grid ${color} w-56 h-24 rounded-lg shadow-lg p-2`}>
              <h1 className="text-white text-xl font-semibold">{title}</h1>
              <h1 className=" justify-self-end mr-4 text-white text-xl font-semibold text-end">{value}</h1>
            </div>
          </Link>
            
          )}
         
          
        </div>
    </h1>
    </>
  )
}

export default Home; 