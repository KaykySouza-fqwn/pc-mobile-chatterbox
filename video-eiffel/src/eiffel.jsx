import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Composition, Sequence, registerRoot, useCurrentFrame} from 'remotion';
import {Vector3} from 'three';

const FPS = 24;
const FRAMES = 1501;
const brass = '#d4ac70';
const paper = '#e1d0a7';
const ink = '#211b18';
const night = '#152026';
const rust = '#a65343';
const serif = 'Georgia, Times New Roman, serif';
const sans = 'Arial, sans-serif';

const beams = [];
const levels = [[0,2.28],[1,1.78],[2,1.34],[3,1.00],[4,.72],[5,.52],[6,.38],[7,.31],[8,.27],[9,.22],[10,.16]];
for (let i = 0; i < levels.length - 1; i++) {
  const [y, r] = levels[i];
  const [top, next] = levels[i + 1];
  const corners = [[-1,-1],[1,-1],[1,1],[-1,1]];
  corners.forEach(([x,z], n) => {
    const [nx,nz] = corners[(n + 1) % 4];
    beams.push([[x*r,y,z*r],[x*next,top,z*next],.115]);
    beams.push([[x*r,y,z*r],[nx*r,y,nz*r],.075]);
    if (i > 1) {
      beams.push([[x*r,y,z*r],[nx*next,top,nz*next],.053]);
      beams.push([[nx*r,y,nz*r],[x*next,top,z*next],.053]);
    }
  });
}

const rods = beams.map(([a,b,w]) => {
  const from = new Vector3(...a);
  const to = new Vector3(...b);
  const middle = from.clone().lerp(to,.5);
  const dir = to.clone().sub(from);
  return {w, middle, length:dir.length(), dir:dir.normalize()};
});

function Tower() {
  const frame = useCurrentFrame();
  return <ThreeCanvas width={720} height={1280} dpr={1} camera={{fov:39, position:[0,0,20]}}>
    <hemisphereLight args={['#f0c995','#454856',2.4]}/>
    <directionalLight position={[-6,8,8]} intensity={2.6} color="#f7dfbf"/>
    <group position={[.1,-4.4,0]} rotation={[.06,-.43 + .17 * Math.sin(frame / 170),-.025]}>
      {rods.map(({w,middle,length,dir},i) => <mesh key={i} position={middle}
        onUpdate={mesh => mesh.quaternion.setFromUnitVectors(new Vector3(0,1,0),dir)}>
        <boxGeometry args={[w,length,w]}/>
        <meshStandardMaterial color={i%3===0?'#9b704d':'#694a37'} roughness={.82}/>
      </mesh>)}
      {[2,4.4,9.5].map((y,i)=><mesh key={y} position={[0,y,0]}>
        <boxGeometry args={[[3.02,1.43,.50][i],.17,[3.02,1.43,.50][i]]}/>
        <meshStandardMaterial color="#8e6848"/>
      </mesh>)}
      <mesh position={[0,10.25,0]}>
        <cylinderGeometry args={[.024,.13,.65,8]}/>
        <meshStandardMaterial color="#8e6848"/>
      </mesh>
    </group>
  </ThreeCanvas>;
}

function Skyline() {
  return <svg width="720" height="1280" viewBox="0 0 720 1280" style={{position:'absolute'}}>
    <defs><linearGradient id="sky" x2="0" y2="1"><stop stopColor="#132329"/><stop offset="1" stopColor="#9b7860"/></linearGradient></defs>
    <rect width="720" height="1280" fill="url(#sky)"/>
    <circle cx="518" cy="385" r="164" fill="#c9a775" opacity=".32"/>
    {[0,1,2].map((row)=><g key={row} opacity={.45+row*.19} fill={['#5e5149','#3a3936','#1e2628'][row]}>
      {Array.from({length:14},(_,i)=>{
        const x=i*57-40+row*12, y=830+row*46+((i*41+row*29)%93);
        return <g key={i}>
          <path d={`M${x} 1110V${y}l24 -17 34 13V1110Z`}/>
          <rect x={x+9} y={y+15} width="5" height="12" fill={brass} opacity=".35"/>
          <rect x={x+32} y={y+15} width="5" height="12" fill={brass} opacity=".35"/>
        </g>;
      })}
    </g>)}
    <path d="M0 1020 Q240 960 720 1032V1280H0Z" fill="#161e20"/>
  </svg>;
}

function Portrait({kind='lustig', x=0, y=0, scale=1}) {
  const poisson=kind==='poisson';
  const skin=poisson?'#a77b5a':'#b59270';
  const suit=poisson?'#525452':'#303c3d';
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-132 224L-119 151Q-95 117-39 103L36 99Q102 114 129 151L149 224Z" fill={suit} stroke={ink} strokeWidth="4"/>
    <path d="M-42 106L0 192 43 106 19 91H-21Z" fill="#c3b7a0"/>
    <path d="M-50 108L-64 130 -29 146 -53 155 0 211 -35 111M50 108l21 24-35 15 22 13L0 211 36 108" fill={poisson?'#63605a':'#455052'} stroke={ink} strokeWidth="2"/>
    <path d="M0 126l10 13-6 13 11 40-15 21-12-22 8-39-5-14Z" fill={rust}/>
    <path d="M-27 69L-28 105 0 128 31 103 24 67Z" fill={skin} stroke={ink} strokeWidth="3"/>
    <path d="M-52 -17Q-47 -57-10 -62Q30 -65 45 -38L47 7 55 27 42 34 37 59Q23 84-2 90Q-25 84-39 63L-46 39Q-61 36-62 20Q-63 6-51 5Z" fill={skin} stroke={ink} strokeWidth="4"/>
    <path d="M-51 -1Q-60 -8-53 -30Q-48 -58-15 -69Q16 -74 42 -51L46 -38Q28 -46 10 -34Q-15 -22-43 -23L-43 11Z" fill="#292622"/>
    <path d="M-39 42Q-20 76-1 81Q20 79 37 59L23 62 9 48-12 45Z" fill="#6e4c38" opacity=".54"/>
    <path d="M-31 10Q-19 3-10 10M11 6Q24 2 33 7M2 14l4 16-10 7M9 54q9 3 19 -1" fill="none" stroke={ink} strokeWidth="3"/>
    <circle cx="-20" cy="13" r="2.8" fill={ink}/><circle cx="25" cy="11" r="2.8" fill={ink}/>
    {poisson && <path d="M0 45Q14 37 32 45L31 50Q16 47 0 52Z" fill={ink}/>}
    {!poisson && <><path d="M-70 -36L-56 -83Q-22 -93-6 -79Q17 -89 39 -76L52 -37Z" fill="#394143" stroke={ink} strokeWidth="4"/><path d="M-61 -49L48 -50 53 -36H-65Z" fill="#22272a"/><path d="M-98 -36Q-17 -49 84 -39Q78 -25-8 -24Q-78 -23-98 -36Z" fill="#2a3032" stroke={ink} strokeWidth="3"/></>}
  </g>;
}

function Document({x=0,y=0,angle=0,label='CONFIDENTIEL',subtitle='PARIS',seal=true}) {
  return <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    <rect x="10" y="13" width="274" height="370" fill="#151515" opacity=".45"/>
    <rect width="274" height="370" fill={paper} stroke="#8c7355" strokeWidth="3"/>
    <rect x="14" y="15" width="246" height="339" fill="none" stroke="#a58c66"/>
    <text x="137" y="57" textAnchor="middle" fill={ink} fontFamily={serif} fontSize="19">{label}</text>
    <text x="137" y="84" textAnchor="middle" fill="#765e46" fontFamily={sans} fontSize="10" letterSpacing="3">{subtitle}</text>
    <path d="M44 106H230" stroke="#765e46"/>
    {Array.from({length:11},(_,i)=><path key={i} d={`M43 ${130+15*i}h${i%4===3?133:182}`} stroke="#8a7659" opacity=".63"/>)}
    <path d="M61 322q42-33 30-6t62-4" stroke="#705343" fill="none" strokeWidth="2"/>
    {seal&&<g><circle cx="208" cy="312" r="26" fill={rust}/><circle cx="208" cy="312" r="19" fill="none" stroke="#d58668"/><path d="M200 313l6 5 11-13" fill="none" stroke={paper} strokeWidth="2"/></g>}
  </g>;
}

function Room() {
  return <>
    <path d="M0 220H720V810H0Z" fill="#34413e"/>
    <path d="M42 243H678V710H42ZM75 271H645V682H75Z" fill="#7e6750" fillRule="evenodd"/>
    {[95,269,443].map(x=><g key={x} transform={`translate(${x} 305)`}>
      <path d="M0 300V84a68 68 0 01136 0v216Z" fill="#1d292b" stroke="#967652" strokeWidth="6"/>
      <path d="M68 32V300M0 123H136M0 207H136" stroke="#766452" strokeWidth="3"/>
    </g>)}
    <path d="M0 756L720 755V930H0Z" fill="#282724"/>
  </>;
}

function Art({type}) {
  const frame=useCurrentFrame();
  const drift=Math.min(frame/170,1);
  return <svg width="720" height="1280" viewBox="0 0 720 1280" style={{position:'absolute'}}>
    <defs>
      <radialGradient id="desk"><stop stopColor="#655343"/><stop offset="1" stopColor="#202625"/></radialGradient>
      <radialGradient id="halo"><stop stopColor={brass} stopOpacity=".35"/><stop offset="1" stopColor={brass} stopOpacity="0"/></radialGradient>
    </defs>
    <rect width="720" height="1280" fill="url(#desk)"/>
    <g transform={`translate(${-8*drift} ${-16*drift}) scale(${1+.045*drift})`}>
      {type==='press' && <>
        <Document x={104} y={374} angle={-13} label="LE JOURNAL" subtitle="TOUR EIFFEL" seal={false}/>
        <Document x={311} y={430} angle={9} label="ENTRETIEN" subtitle="COÛTS DE MAINTENANCE"/>
        <circle cx="468" cy="576" r="78" fill="none" stroke={rust} strokeWidth="5" opacity={.75}/>
        <path d="M548 767l67 82" stroke="#b88452" strokeWidth="10"/>
      </>}
      {type==='identity' && <>
        <ellipse cx="354" cy="566" rx="300" ry="340" fill="url(#halo)"/>
        <Portrait x={338} y={473} scale={1.8}/>
        <Document x={448} y={654} angle={10} label="MINISTÈRE" subtitle="CORRESPONDANCE"/>
      </>}
      {type==='letters' && <>
        <Document x={184} y={365} angle={-11} label="INVITATION" subtitle="RÉUNION PRIVÉE"/>
        <Document x={330} y={415+32*(1-drift)} angle={11} label="CONFIDENTIEL" subtitle="PARIS • 1925"/>
        <g transform="translate(92 724) rotate(-9)"><rect width="448" height="207" fill="#ab906b" stroke="#544335" strokeWidth="3"/>
        <path d="M0 2L224 126 448 2M0 207l160-117m288 117L288 90" stroke="#66523d" fill="none" strokeWidth="3"/>
        <circle cx="224" cy="126" r="24" fill={rust}/></g>
      </>}
      {type==='hotel' && <>
        <Room/>
        <Portrait x={363} y={560} scale={1.18}/>
        <path d="M0 843L154 737H566L720 843V952H0Z" fill="#513d31" stroke="#b58d64" strokeWidth="3"/>
        <path d="M305 766l126 0 37 57H269Z" fill={paper}/>
        <Portrait x={36} y={784} scale={1.25} kind="poisson"/>
        <Portrait x={681} y={799} scale={1.23} kind="poisson"/>
      </>}
      {type==='payment' && <>
        <Portrait x={190} y={477} scale={1.44} kind="poisson"/>
        <Document x={357} y={393} angle={10} label="CESSION" subtitle="TOUR EIFFEL"/>
        {[0,1,2,3].map(i=><g key={i} transform={`translate(${295+21*i} ${750+17*i}) rotate(${-12+i*5})`}>
          <rect width="252" height="91" fill="#8a9270" stroke="#3a4a40" strokeWidth="3"/>
          <rect x="8" y="8" width="236" height="75" fill="none" stroke="#50604e"/>
          <ellipse cx="126" cy="45" rx="46" ry="26" fill="none" stroke="#50604e" strokeWidth="2"/>
          <text x="126" y="52" textAnchor="middle" fontFamily={serif} fontSize="22" fill="#3a4a40">FRANCS</text>
        </g>)}
      </>}
      {type==='escape' && <>
        <path d="M0 340H720V800H0Z" fill="#293737"/>
        <path d="M0 360H720V675H0Z" fill="#38464a"/>
        <path d="M0 698L720 707M0 742L720 773M0 787L720 840" stroke="#a3815d" strokeWidth="4"/>
        <g transform={`translate(${38+115*drift} 0)`}>
          <path d="M-178 503h596l92 73v119h-688Z" fill="#313130" stroke="#151d20" strokeWidth="6"/>
          <path d="M-160 505H416L493 564H-160Z" fill="#a0906b" opacity=".46"/>
          {[0,1,2,3,4].map(i=><rect key={i} x={-146+110*i} y="558" width="73" height="66" rx="6" fill="#b98e5e" opacity=".74"/>)}
          {[0,1,2,3].map(i=><circle key={i} cx={-128+156*i} cy="701" r="32" fill="#1b2223" stroke="#57504a" strokeWidth="5"/>)}
        </g>
        <path d="M0 877L720 839V1070H0Z" fill="#242724"/>
        <path d="M110 859h168v108H110Z" fill="#72513a" stroke="#221e19" strokeWidth="5"/>
        <path d="M164 859v-17h55v17M135 861v106m112-106v106" fill="none" stroke="#b49362" strokeWidth="5"/>
      </>}
      {type==='silence' && <>
        <ellipse cx="365" cy="576" rx="270" ry="295" fill="url(#halo)"/>
        <Portrait x={330} y={493} scale={1.92} kind="poisson"/>
        <path d="M0 830H720V975H0Z" fill="#4c3a2d"/>
        <g transform="translate(470 765)">
          <path d="M-49 61Q-15 6 46 6Q91 14 104 61L113 95H-58Z" fill="#272927" stroke={ink} strokeWidth="4"/>
          <path d="M-72 6Q-16-59 85-16L109 11 87 36 51 25 47 4Q17-7-8 13L-11 35-44 48Z" fill="#323633" stroke={ink} strokeWidth="4"/>
          <ellipse cx="25" cy="61" rx="38" ry="18" fill="#56544a"/>
        </g>
      </>}
      {type==='return' && <>
        <Document x={113} y={395} angle={-13} label="TOUR EIFFEL" subtitle="PARIS • 1925"/>
        <Document x={330} y={424} angle={11} label="NOUVELLE OFFRE" subtitle="CONFIDENTIEL"/>
        <Portrait x={115} y={815} scale={1.35}/>
        {frame>214 && <g transform="translate(368 646) rotate(-12)"><rect x="-164" y="-47" width="328" height="94" fill="none" stroke={rust} strokeWidth="7"/><text y="14" textAnchor="middle" fill={rust} fontSize="41" fontWeight="bold" fontFamily={sans}>FRACASSOU</text></g>}
      </>}
    </g>
  </svg>;
}

const shots = [
  [0,'tower','PARIS, 1925','A venda impossível'],
  [6.2,'tower','O MONUMENTO','Nunca esteve à venda'],
  [9.02,'press','A OPORTUNIDADE','Manutenção cara'],
  [16.26,'identity','O IMPOSTOR','Victor Lustig'],
  [21.88,'letters','A ARMADILHA','Convites em segredo'],
  [28,'hotel','PARIS','A reunião no hotel'],
  [35.03,'payment','O COMPRADOR','André Poisson'],
  [40.88,'escape','A FUGA','Destino: Áustria'],
  [46.49,'silence','O SILÊNCIO','Poisson não denuncia'],
  [50.96,'return','DE VOLTA A PARIS','Uma segunda tentativa'],
];

function Shot({type,kicker,title}) {
  const frame=useCurrentFrame();
  return <AbsoluteFill style={{background:night,overflow:'hidden'}}>
    {type==='tower'?<><Skyline/><Tower/></>:<Art type={type}/>}
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 51% 46%, transparent 31%, #10141788 100%), linear-gradient(0deg, #11191cee 3%, transparent 31%, transparent 77%, #12191b95 100%)'}}/>
    <div style={{position:'absolute',top:90,left:55,right:55,display:'flex',alignItems:'center',gap:16,color:brass,fontFamily:sans,fontSize:17,letterSpacing:5}}>
      {kicker}<span style={{height:1,background:brass,opacity:.58,flex:1}}/>
    </div>
    <div style={{position:'absolute',bottom:105,left:55,right:50,color:paper,opacity:Math.min(1,.52+frame/15)}}>
      <div style={{width:44,height:3,background:rust,marginBottom:20}}/>
      <div style={{fontFamily:serif,fontSize:58,letterSpacing:-1,lineHeight:1.03}}>{title}</div>
    </div>
  </AbsoluteFill>;
}

function Eiffel() {
  return <AbsoluteFill>{shots.map(([start,type,kicker,title],i)=>{
    const from=Math.round(start*FPS);
    const end=i+1===shots.length?FRAMES:Math.round(shots[i+1][0]*FPS);
    return <Sequence key={start} from={from} durationInFrames={end-from}>
      <Shot {...{type,kicker,title}}/>
    </Sequence>;
  })}</AbsoluteFill>;
}

registerRoot(()=> <Composition id="Eiffel1925" component={Eiffel} width={720} height={1280} fps={FPS} durationInFrames={FRAMES}/>);
