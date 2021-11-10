

export function basicStrategy(player,computer,isSoft,isSplitPossible){
    
    if(isSplitPossible){
        if(player<=6){ //22, 33
            if(computer>=2 && computer<=7){return 'P';}
            else{return 'H';}
        }

        if(player==8){ //44
            if(computer>=5 && computer<=6){return 'P';}
            else{return 'H';}
        }

        if(player==10){ //55
            if(computer<=9){return 'D';}
            else{return 'H';}
        }

        if(player==12){ //66
            if(computer<=6){return 'P';}
            else{return 'H';}
        }

        if(player==14){ //77
            if(computer<=7){return 'P';}
            else{return 'H';}
        }

        if(player==16){ //88
            return 'P';
        }

        if(player==18){ //99
            if(computer>=10 || computer==7){return 'P';}
            else{return 'S';}
        }

        if(player==20){ //10 10
            return 'S';
        }

        return 'P';
    }
    else if(isSoft){
        //soft total

        if(player<=14){ //A2, A3
            if(computer>=2 && computer<=4 || computer>=7){return 'H';}
            else{return 'D';}
        }

        if(player==15 || player==16){ //A4,A5
            if(computer>=2 && computer<=3 || computer>=7){return 'H';}
            else{return 'D';}
        }

        if(player==17){ //A6
            if(computer==2 || computer>=7){return 'H';}
            else{return 'D';}
        }

        if(player==18){ //A7
            if(computer>=3 && computer<=6){return 'D';}
            else if(computer==7 || computer == 8 || computer <=2){return 'S';}
            else{return 'H';}
        }

        if(player>=19){ //A8
            return 'S';
        }

        if(player>=20){
            return 'S';
        }
        
    }else{
        //hard total
        if(player<=8){return 'H';}

        if(player==9){
            if(computer==2 || computer>=7){return 'H';}
            else{return 'D';}
        }

        if(player==10){
            if(computer>=2 && computer<=9){return 'D';}
            else{return 'H';}
        }

        if(player==11){
            return 'D';
        }

        if(player==12){
            if(computer>=2 && computer<=3 || computer>=7){return 'H';}
            else{return 'S';}
        }

        if(player>=13 && player<=16){
            if(computer>=2 && computer<=6){return 'S';}
            else{return 'H';}
        }

        if(player>=17){
            return 'S';
        }
 
    }

}