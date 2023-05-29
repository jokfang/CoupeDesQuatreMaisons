import {item} from '../interface/item.js'
export class couteau extends item{
    onMonster() {
        return {
            result: 4,
            point: 5,
            xp: 0,
            message: 'Ce n\'est pas un couteau à beurre que tu as là, tu blesses la créature !'
        }
    }
}