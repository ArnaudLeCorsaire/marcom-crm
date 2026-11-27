// Dossier réseau simulé : les fichiers sont gardés côté test (Node), partagés entre toutes les pages
(()=>{
  class FH{constructor(p,n){this.kind='file';this.name=n;this.p=p}
    async getFile(){const v=await window.mfsGet(this.p);if(v==null){const e=new Error('nf');e.name='NotFoundError';throw e}const f=new File([v.data],this.name);Object.defineProperty(f,'lastModified',{value:v.t});return f}
    async createWritable(){const p=this.p;let buf='';return{write:async c=>{buf+=typeof c==='string'?c:await new Blob([c]).text()},close:async()=>{await window.mfsSet(p,buf)}}}}
  class DH{constructor(p,n){this.kind='directory';this.p=p;this.name=n}
    async queryPermission(){return 'granted'}async requestPermission(){return 'granted'}
    async getFileHandle(n,o){const p=this.p+'/'+n;if(!(o&&o.create)&&(await window.mfsGet(p))==null){const e=new Error('nf');e.name='NotFoundError';throw e}return new FH(p,n)}
    async getDirectoryHandle(n,o){return new DH(this.p+'/'+n,n)}
    async *values(){const l=await window.mfsList(this.p+'/');for(const n of l)yield new FH(this.p+'/'+n,n)}}
  window.showDirectoryPicker=async()=>new DH('root','Konex équipe (test)');
})();
