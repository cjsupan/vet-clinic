import useSWR, {mutate} from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());
const postClients = params => url => post(url, params)
export function getClients (allClients) {
    const { data, error, isValidating, mutate} = useSWR(`http://localhost:3000/api/clients`, fetcher, {initialValues: allClients, revalidateOnFocus: false});
    return {
      data: data,
      isValidating,
      mutate,
      isError: error,
    }
  }

export function addClient(values){
  let res = fetcher('http://localhost:3000/api/clients', {
    method: 'POST',
    body: JSON.stringify(values)
  });

  return res;
}

