import { GridItemType } from '../../types/GridItemType'
import * as C from './styles';
import b7Svg from "../../svgs/b7.svg"
import {items} from '../../data/items'

type Props= {
    item:GridItemType;
    onClick: () => void
}

export const GridItem =({item, onClick}:Props) =>{
    return(
        <C.Container
        showBackground={item.permaShown || item.shown}
         onClick={onClick}>
            {!item.permaShown && !item.shown &&
                <C.Icon src={b7Svg} alt='' opacity={.1}/>
            } 
            {(item.permaShown || item.shown) && item.item !==null &&
                <C.Icon src={items[item.item].icon} alt=''/>
            }
         
        </C.Container>
    )
}