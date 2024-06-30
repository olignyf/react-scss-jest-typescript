
import { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; 
import { TodosEntry } from './todos-model';

var T = require('src/utils/ui-toolbox');
var CaptureMousePosition = require('src/utils/capture-mouse-position')

/* extends {id:string|number}*/
interface Props {
  id?: string;
  model: TodosEntry;
}

/**
 *
 */
export const TodosItem = (props: Props) => {
    const { id, model, ...rest } = props;
    const { t } = useTranslation();

    console.log('render todo', model.id)

    useEffect(() => {
      
		   const els = T.getAllElements(".jsDragMe");
       let unbinders = T.onEvent('mousedown', els, function(event)
       {
         var element = event.currentTarget;
         var options = {};
         if (element.attributes['data-drag-removeClass'] != null)
         {
           options.removeClass = element.attributes['data-drag-removeClass'].value;
         }
         
         if (element.attributes['data-drag-replaceWith'] != null)
         {
           options.replaceWith = element.attributes['data-drag-replaceWith'].value;
         }
         
         CaptureMousePosition.startDrag(element.id, event, options);
       });
       unbinders.splice(0, 0, unbinders); // push unbinders
       
       unbinders = T.onEvent('mouseup', els, function(event)
       {
            var element = event.currentTarget;
         var wasDragging = CaptureMousePosition.stopDrag();
         
         if (wasDragging != 2) // 2 == got moved
         {
          // onClickDiv(element, self);
         }
       });
       
       unbinders.splice(0, 0, unbinders); // push unbinders

    }, []);
  console.log('todo', model)
  return <div id={id ?? `id_div_city_${model.id}`} className="jsDragEl city transition500ms jsDragMe" data-drag-removeClass="transition500ms" data-drag-replaceWith="#tmplCityPlaceholder" data-name={model.name} todo-id={model.id} data-drag-id={`todo_${model.id}`} >
	<h3>{model.name}</h3>
	<div className="loading"><img src="img/loading-64x64.gif" alt="loading"/></div>
		<div className="data">
			<span>{model.details}°C</span>
			<div className="icon"><img src="http://openweathermap.org/img/w/%%weather[0].icon%%.png" width="50" height="50" alt={model.details} title={model.details}/></div>
		</div>
</div>;

    return  <li className="item todo jsDragEl transition500ms jsDragMe" id={id ?? `id_div_city_${model.id}`} {...rest} data-drag-removeClass="transition500ms" 
    data-drag-replaceWith="#tmplCityPlaceholder" data-name="%%name%%" todo-id={model.id} data-drag-id={`todo_${model.id}`}>
       <span>{model.id}</span>
       <span>{model.name}</span>
       <span>{model.details}</span>
       <span>{model.mtime}</span>
       {model.thumbnail && <img src={model.thumbnail}/>}
    </li>;
  };
   