// Independent evaluator for trusted test MathML. No eval/Function or production grading.
export function mathMLFunction(html){
 const source=html.match(/<math\b[^>]*>[\s\S]*?<\/math>/)?.[0];if(!source)throw Error('Missing MathML');
 const root={tag:'root',children:[]},stack=[root];
 for(const token of source.match(/<[^>]*>|[^<]+/g)||[]){if(token.startsWith('</'))stack.pop();else if(token.startsWith('<')){const tag=token.match(/^<([\w]+)/)?.[1];if(!tag)continue;const node={tag,children:[]};stack.at(-1).children.push(node);if(!token.endsWith('/>'))stack.push(node);}else stack.at(-1).children.push(token);}
 function value(node,scope){if(typeof node==='string')return Number(node.replace(',','.'));const kids=node.children.filter(v=>typeof v!=='string'||v.trim()),text=kids.filter(v=>typeof v==='string').join('').trim();
  if(node.tag==='mn')return Number(text.replace(',','.'));
  if(node.tag==='mi'){if(text==='e')return Math.E;if(text==='π')return Math.PI;if(text==='C')return 0;if(Object.hasOwn(scope,text))return scope[text];throw Error('Unknown symbol '+text);}
  if(node.tag==='msup')return value(kids[0],scope)**value(kids[1],scope);
  if(node.tag==='mfrac')return value(kids[0],scope)/value(kids[1],scope);
  if(node.tag==='msqrt')return Math.sqrt(row(kids,scope));
  if(node.tag==='mspace')return 1;
  return row(kids,scope);
 }
 function row(nodes,scope){let tokens=nodes.filter(v=>typeof v!=='string'||v.trim()).map(node=>node.tag==='mo'?node.children.join('').replace('−','-').replace('·','*'):node.tag==='mi'&&['ln','sin','cos'].includes(node.children.join(''))?node.children.join(''):value(node,scope));const eq=tokens.lastIndexOf('=');if(eq>=0)tokens=tokens.slice(eq+1);let i=0;
  function atom(){const t=tokens[i++];if(t==='('){const v=sum();if(tokens[i++]!==')')throw Error('Parenthesis');return v;}if(t==='|'){const v=sum();if(tokens[i++]!=='|')throw Error('Absolute value');return Math.abs(v);}if(['ln','sin','cos'].includes(t)){const arg=atom();return t==='ln'?Math.log(arg):Math[t](arg);}if(typeof t==='number')return t;throw Error('Atom '+t);}
  function unary(){if(tokens[i]==='-'){i++;return-unary();}if(tokens[i]==='+'){i++;return unary();}return atom();}
  function product(){let v=unary();while(i<tokens.length&&!['+', '-', ')','|','='].includes(tokens[i])){const op=tokens[i];if(op==='*'||op==='/'){i++;const w=unary();v=op==='*'?v*w:v/w;}else v*=unary();}return v;}
  function sum(){let v=product();while(tokens[i]==='+'||tokens[i]==='-'){const op=tokens[i++],w=product();v=op==='+'?v+w:v-w;}return v;}
  const result=sum();if(i!==tokens.length)throw Error('Unparsed '+tokens.slice(i));return result;
 }
 return (input,extra={})=>value(root,{x:input,u:input,...extra});
}
