import { useEffect, useState } from 'react';
import * as C from './App.styles';

import logoImage from './assets/devmemory_logo.png'
import RestartIcon from './svgs/restart.svg'

import { InfoItem } from './components/infoItem';
import { Button } from './components/button';
import { GridItem } from './components/GridItem';

import { GridItemType } from './types/GridItemType';
import {items} from './data/items';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';



const App = () =>{
  
  const [playing,setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [showCount, setShowCont] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

 useEffect(()=>{resetAndCreateGrid()},[ ]);

 useEffect(()=>{
    const timer = setInterval(()=>{
      if (playing) setTimeElapsed(timeElapsed + 1); 
    },1000);
    return () => clearInterval(timer)
 },[playing,timeElapsed]);


  //Verify if opened are equal
  useEffect(()=>{
    if(showCount===2){
      let opened = gridItems.filter(item=> item.shown === true);
      console.log(opened)
      
      if(opened.length === 2){

        
        if(opened[0].item === opened[1].item){
          //V1 - If both are equal, make every "shown" permanent
          let tmpGrid = [...gridItems];
          for (let i in tmpGrid){
            if (tmpGrid[i].shown){
              tmpGrid[i].permaShown=true;
              tmpGrid[i].shown=false
            }
          }
          setGridItems(tmpGrid);
          setShowCont(0);
        }
        else{
          //V2 - if they are NOT equal, close all "Shown"
          setTimeout(() => {
            let tmpGrid = [...gridItems];
            for (let i in tmpGrid){
             tmpGrid[i].shown=false;
            }
            setGridItems(tmpGrid);
            setShowCont(0);
          }, 1000);
          
        }
        

        setMoveCount(moveCount=>moveCount+1)
      }
    }
  },[showCount,gridItems])


  //Game Over
  useEffect(()=>{
    if(moveCount>0 && gridItems.every(item=>item.permaShown ===true)){
      setPlaying(false)
    }
  },[moveCount,gridItems])


  const resetAndCreateGrid = () =>{
    //Reset Game
    setTimeElapsed(0);
    setMoveCount(0);
    setShowCont(0);

    //Create Empty Grid
    let tempGrid:GridItemType[]=[];
    for (let i=0; i<(items.length * 2); i++) tempGrid.push({
      item:null, shown:false, permaShown: false
    });
    //Fill Grid
    for (let w=0; w<2;w++){
      for(let i=0;i< items.length;i++){
        let position=-1;
        while(position < 0 || tempGrid[position].item !== null){
          position = Math.floor(Math.random() * (items.length *2));
          
        }
        
        tempGrid[position].item=i
      }
    }
    setGridItems(tempGrid)

    //Create Grid and init Game
    setPlaying(true);


    
  }
  const handleItemClick = (index:number)=>{
      if(playing && index!==null && showCount < 2){
        let tmpGrid= [...gridItems];

        if(tmpGrid[index].permaShown===false && tmpGrid[index].shown===false){
          tmpGrid[index].shown=true;
          setShowCont(showCount + 1);
        }
        setGridItems(tmpGrid);
      }
  }
  


  return(
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={logoImage} width="200" alt=''/>
        </C.LogoLink>
        <C.InfoArea>
          
          <InfoItem label='Tempo' value={formatTimeElapsed(timeElapsed)}/>
          <InfoItem label='Movimentos' value={moveCount.toString()}/>
        </C.InfoArea>

        <Button icon={RestartIcon} label="Reiniciar" onClick={resetAndCreateGrid}/>
      </C.Info>
      <C.GridArea>
        <C.Grid>
          {gridItems.map((item,index)=>(
            <GridItem
            key={index}
            item={item}
            onClick={()=>handleItemClick(index)}
            />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  );
}
export default App