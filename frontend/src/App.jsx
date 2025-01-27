import { useState } from 'react'
import './App.css'
import * as Label from "@radix-ui/react-label";
import "axios";


import { Flex, TextField, Box, IconButton,  Heading, Link  } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import axios from 'axios';

function IFrame({title, id}) {
  return(
    <iframe 
      width="560" 
      height="315" 
      src={ "https://www.youtube.com/embed/" + id }
      title={title}
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      referrerpolicy="strict-origin-when-cross-origin" 
      allowfullscreen>
    </iframe>
  )
}


function App() {
  
 const [q, setQ] = useState('');
 const [vids, setVids] = useState([]);
 axios.defaults.headers.get['Content-Type'] = 'application/json';
 axios.defaults.headers.post['Content-Type'] = 'application/json';

 function queryVideos() {
  axios.post('/api/query', {q}).then((x) => {setVids(x.data)})
 }


  return (
    <>

    <Heading>The internet has been <Link href="https://en.wikipedia.org/wiki/Dead_Internet_theory">dead</Link> since 2016. Search for old videos on YouTube before bots started uploading AI generated 💩</Heading>
    <Flex gap="2">
      <TextField.Root 
        size="3"
        placeholder="Search old videos…"         
        value={q}
        onChange={(e) => setQ(e.target.value)} />
      <IconButton>
        <MagnifyingGlassIcon width="18" height="18" onClick={queryVideos}/>
      </IconButton>

      <Flex direction="column" gap="3">
      {vids.map((x) =>
    <IFrame title={x.title} id={x.id}/>
      )}
      </Flex>


	  </Flex>
    </>
  )
}

export default App
