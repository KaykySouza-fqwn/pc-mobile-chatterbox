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
    <group position={[.1,-4.4,-2+frame*.035]} rotation={[.06,-.65 + frame*.009,-.025]}>
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

function Document({x=0,y=0,angle=0,label='CONFIDENCIAL',subtitle='PARIS',seal=true}) {
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

function NewScene({type, p, frame}) {
  if (type==='auction') return <>
    <path d="M0 300L720 465V1060L0 887Z" fill="#5b3830"/>
    <path d="M0 837l720-68v340H0Z" fill="#38221f"/>
    <Portrait kind="poisson" x={325} y={475} scale={1.65}/>
    <g transform={`translate(${500-64*p} ${765-126*p}) rotate(${21-33*p})`}>
      <path d="M0 0H183V123H0Z" fill={paper} stroke="#ae8758" strokeWidth="4"/>
      <text x="91" y="76" textAnchor="middle" fontFamily={serif} fontSize="38" fill={ink}>OFERTA</text>
      <path d="M77 123h29v179H77Z" fill="#815b3f"/>
    </g>
  </>;
  if (type==='river') return <>
    <path d="M0 300H720V873H0Z" fill="#36474b"/>
    <circle cx="550" cy="477" r="160" fill="#aaa282"/>
    {[0,1,2,3,4,5,6,7].map((i)=><path key={i} d={`M${i*101-30} 755v-${75+(i*19)%101}l48-32 49 32v${75+(i*19)%101}Z`} fill={i%2?'#46433b':'#564d42'}/>)}
    <path d="M0 724L720 810V1060H0Z" fill="#536f70"/>
    {[0,1,2,3,4,5].map(i=><path key={i} d={`M${-110+frame*4+i*104} ${824+i*27}h${140-i*10}`} stroke="#b3ad90" opacity=".5" strokeWidth="3"/>)}
    <path d="M0 734L720 813V853L0 773Z" fill="#333d3c"/>
  </>;
  if (type==='worker') return <>
    <path d="M0 284H720V958H0Z" fill="#4f5149"/>
    <g stroke="#242927" strokeWidth="26"><path d="M-80 300L760 930M-80 950L760 335M-70 610H780"/></g>
    <g transform={`translate(${360+28*p} ${598-52*p})`} stroke="#252724" strokeWidth="20" strokeLinecap="round">
      <path d="M0-251V-35M-6 57l-62 90m70-85 69 66M-14 0l-74-18m106 23 77-65"/>
      <path d="M-25-18h45l20 102h-74Z" fill="#87684e"/>
      <circle cx="-1" cy="-59" r="27" fill="#b19773"/>
      <path d="M-32-70H31" stroke="#38342f"/>
      <path d="M106-77l39-47m-9-8 26 22" stroke={brass} strokeWidth="9"/>
    </g>
  </>;
  if (type==='ledger') return <g transform="translate(98 340) rotate(-8 265 270)">
    <rect width="528" height="556" fill="#737f6e" stroke="#253d37" strokeWidth="12"/>
    <rect x="37" y="35" width="455" height="484" fill={paper}/>
    <text x="264" y="104" textAnchor="middle" fontFamily={serif} fill={ink} fontSize="32">DESPESAS DA TORRE</text>
    {[0,1,2,3,4,5].map(i=><path key={i} d={`M72 ${160+i*52}h376`} stroke="#877960" opacity=".65"/>)}
    <path d="M82 417L170 367 243 380 325 298 425 217" fill="none" stroke={rust} strokeWidth="8" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p}/>
  </g>;
  if (type==='scheme') return <>
    <ellipse cx="355" cy="621" rx="350" ry="320" fill="#714c35"/>
    <path d="M0 810L720 720V1000H0Z" fill="#292323"/>
    <Portrait x={340} y={485} scale={1.35}/>
    <g transform={`translate(${103+59*p} 700) rotate(-13)`}><rect width="380" height="163" fill={paper}/><path d="M40 39h285m-285 29h215m-215 29h265" stroke="#695640" strokeWidth="4"/><path d="M283 127l111-70" stroke="#332824" strokeWidth="12"/></g>
  </>;
  if (type==='credential') return <g transform={`translate(115 ${425+94*(1-p)}) rotate(${-14+7*p} 242 148)`}>
    <rect width="480" height="297" rx="7" fill="#d6c4a0" stroke="#876c53" strokeWidth="8"/>
    <rect x="30" y="30" width="420" height="237" fill="none" stroke="#826c50" strokeWidth="2"/>
    <circle cx="114" cy="151" r="48" fill="#8c4739"/><path d="M89 151h51m-25-25v50" stroke={paper} strokeWidth="5"/>
    <text x="185" y="135" fill={ink} fontFamily={serif} fontSize="31">GOVERNO</text>
    <text x="185" y="175" fill={ink} fontFamily={serif} fontSize="31">FRANCÊS</text>
    <path d="M185 197h220" stroke="#a5815e" strokeWidth="2"/>
  </g>;
  if (type==='mailbox') return <>
    <path d="M0 380H720V956H0Z" fill="#526168"/>
    {[0,1,2,3].map(i=><path key={i} d={`M0 ${447+i*126}H720`} stroke="#344750" strokeWidth="8"/>)}
    <rect x="194" y="455" width="333" height="432" rx="32" fill="#6f3f36" stroke="#332c2b" strokeWidth="8"/>
    <text x="360" y="570" textAnchor="middle" fill={paper} fontFamily={serif} fontSize="35">CORREIO</text>
    <rect x="240" y="622" width="240" height="37" rx="5" fill="#251f1d"/>
    <g transform={`translate(267 ${528+115*p}) rotate(${14*(1-p)}) scale(1 ${1-.85*p})`}><rect width="181" height="96" fill={paper}/><path d="M0 0l90 57 91-57" fill="none" stroke="#857052" strokeWidth="2"/></g>
  </>;
  if (type==='facade') return <>
    <path d="M59 370L359 275 661 370V964H59Z" fill="#8a7763" stroke="#413c38" strokeWidth="7"/>
    <path d="M0 805L720 804V986H0Z" fill="#353433"/>
    {[0,1,2,3,4].map(i=><g key={i} transform={`translate(${93+111*i} 425)`}>
      <path d="M0 268V76a38 38 0 0 1 76 0v192Z" fill={i===2?'#af8657':'#394348'} stroke="#645341" strokeWidth="5"/>
      <path d="M38 39v229M0 105h76m-76 70h76" stroke="#5f5145" strokeWidth="3"/>
    </g>)}
    <path d="M153 740h414v86H153Z" fill="#283035" stroke={brass} strokeWidth="3"/>
    <text x="360" y="796" textAnchor="middle" fill={paper} fontFamily={serif} fontSize="40">HOTEL</text>
  </>;
  if (type==='demolition') return <>
    <path d="M0 343H720V965H0Z" fill="#534e48"/>
    <path d="M-80 427L740 834M-80 855L739 424M0 665H720" stroke="#272e2e" strokeWidth="39"/>
    <g transform={`translate(${310+58*p} 614)`} stroke={brass} strokeLinecap="round">
      <path d="M0-300V-40q0 65-57 65" fill="none" strokeWidth="13"/>
      <path d="M-45 14l-154 123m161-123 169 123" fill="none" strokeWidth="5"/>
      <path d="M-215 123h356v46h-356Z" fill="#9f7250" stroke="#422e25" strokeWidth="5"/>
    </g>
    {[0,1,2,3,4,5].map(i=><path key={i} d={`M${355+i*14} ${638-i*13}l${18+12*p} ${-19-i*2}`} stroke="#d39562" strokeWidth="3" opacity={(1-p)*.8}/>)}
  </>;
  if (type==='scrap') return <>
    <path d="M0 356H720V950H0Z" fill="#3b5151"/>
    <path d="M0 731L720 696V988H0Z" fill="#272b29"/>
    {[0,1,2,3,4,5,6].map(i=><g key={i} transform={`translate(${-65+i*113} ${778-i%3*48-23*p}) rotate(${-27+i*9})`}>
      <path d="M0 0h196v41H0Z" fill={i%2?'#725948':'#8b6d50'} stroke="#322e28" strokeWidth="5"/>
      <path d="M9 13h176" stroke="#b0916b" strokeWidth="4"/>
    </g>)}
    <path d="M360 337v160m0 0q-64 0-64 56t64 30" fill="none" stroke={brass} strokeWidth="9"/>
  </>;
  if (type==='cash') return <>
    <path d="M0 515L720 400V962L0 1040Z" fill="#5a3d31"/>
    <g transform="translate(145 495) rotate(-8 230 175)">
      <path d="M0 70h440v283H0Z" fill="#30241e" stroke="#9c7453" strokeWidth="7"/>
      <path d="M0 70L39 0H400l40 70Z" fill="#6d4d37" stroke="#9c7453" strokeWidth="5"/>
      {[0,1,2,3].map(i=><g key={i} transform={`translate(${42+i%2*189} ${109+Math.floor(i/2)*92-18*(1-p)})`} opacity={Math.min(1,p*3-i*.18)}>
        <rect width="164" height="72" fill="#8a9674" stroke="#4b604e" strokeWidth="3"/>
        <ellipse cx="82" cy="36" rx="27" ry="18" fill="none" stroke="#495f49"/>
        <path d="M70 0h24v72H70Z" fill="#c0aa7f"/>
      </g>)}
    </g>
  </>;
  if (type==='empty') return <>
    <path d="M102 315H634V937H102Z" fill="#70564a"/>
    <path d="M171 392H562V917H171Z" fill="#252e30" stroke="#a1876b" strokeWidth="7"/>
    <path d={`M174 392L${510-113*p} ${413+11*p}V${840-17*p}L174 914Z`} fill="#594238" stroke="#b09070" strokeWidth="5"/>
    <path d="M300 840h300l71 118H210Z" fill="#3a3331"/>
    <path d="M494 733h67v113h-67zm-18 113h102m-74 1v80m46-80v80" stroke="#8c6d54" fill="none" strokeWidth="9"/>
  </>;
  if (type==='phone') return <>
    <path d="M0 693L720 616V1040H0Z" fill="#65493b"/>
    <ellipse cx="366" cy="651" rx="300" ry="277" fill="url(#halo)"/>
    <path d="M245 651q89-99 190-10l41 107v90H211v-85Z" fill="#343a3a" stroke="#161e1f" strokeWidth="8"/>
    <ellipse cx="344" cy="730" rx="81" ry="49" fill="#6e6960" stroke="#252b2a" strokeWidth="7"/>
    {[0,1,2,3,4,5,6,7].map(i=><circle key={i} cx={344+47*Math.cos(i*Math.PI/4)} cy={730+27*Math.sin(i*Math.PI/4)} r="9" fill="#303534"/>)}
    <path d="M165 595q118-112 340 2l23 43-47 55-75-34-17-36q-54-35-113-2l-18 44-71 28-41-49Z" fill="#3e4748" stroke="#181f20" strokeWidth="9" transform={`rotate(${4*Math.sin(frame*.4)*(1-p)} 342 625)`}/>
    <path d={`M${-190+164*p} 799q107-97 211-58l71 44-14 38-97-18-112 94Z`} fill="#ab8368" stroke="#563e35" strokeWidth="4"/>
  </>;
  if (type==='desk') return <>
    <path d="M0 395L720 485V969H0Z" fill="#676251"/>
    <path d="M0 696H720V1028H0Z" fill="#554034"/>
    <path d="M289 507h132l45 97H234Z" fill="#a88958" stroke="#54462f" strokeWidth="5"/>
    <path d="M351 605v117m-77 0h152" fill="none" stroke={brass} strokeWidth="12"/>
    <g transform={`translate(${192-102*p} ${789+31*p}) rotate(-9)`}><rect width="350" height="117" fill="#8e7657"/><rect x="25" y="20" width="302" height="76" fill={paper}/><text x="176" y="68" textAnchor="middle" fontFamily={serif} fontSize="28" fill={ink}>SEM DENÚNCIA</text></g>
  </>;
  if (type==='map') return <>
    <path d="M0 305H720V960H0Z" fill="#587076"/>
    <path d="M0 471L154 381 305 427 366 365 601 400 720 502V960H0Z" fill="#9d9271"/>
    <path d="M33 753L176 599 310 673 442 530 674 597M76 463L236 550 364 462 587 500" fill="none" stroke="#756f56" strokeWidth="4"/>
    <path d="M571 573Q427 442 185 637" fill="none" stroke="#783c32" strokeWidth="8" pathLength="1" strokeDasharray="1" strokeDashoffset={1-p}/>
    <circle cx="571" cy="573" r="14" fill={rust}/><circle cx="185" cy="637" r={10+7*p} fill="#683831"/>
    <text x="545" y="625" fill={ink} fontSize="29" fontFamily={serif}>ÁUSTRIA</text><text x="137" y="697" fill={ink} fontSize="34" fontFamily={serif}>PARIS</text>
  </>;
  if (type==='silhouette') return <>
    <path d="M0 341H720V968H0Z" fill="#667e7b"/>
    <circle cx="360" cy="518" r="166" fill="#c4ad82"/>
    <path d="M-40 940h800V804l-120-77-92 44-57-61-81 62-105-99-116 75-89-60-140 85Z" fill="#313c3b"/>
    <g transform={`translate(${360+20*p} 837) scale(1.02)`} fill="#1d2b2c">
      <path d="M-265 0Q-100-160-27-490L-20-570H20l7 80Q100-160 265 0H177Q118-170 0-172Q-118-170-177 0Z"/>
      <path d="M-204-120H204v23h-408Zm74-161h260v18h-260ZM-5-611H5v50H-5Z"/>
    </g>
  </>;
  if (type==='reject') return <>
    <path d="M0 328H720V959H0Z" fill="#5a3a35"/>
    <path d="M0 783L720 693V1040H0Z" fill="#302928"/>
    <g transform={`translate(${164-66*p} 435) rotate(-13 180 220)`}>
      <rect width="385" height="449" fill={paper} stroke="#8e7354" strokeWidth="5"/>
      <text x="192" y="72" textAnchor="middle" fill={ink} fontSize="33" fontFamily={serif}>SEGUNDA OFERTA</text>
      {[0,1,2,3,4].map(i=><path key={i} d={`M58 ${139+i*40}h268`} stroke="#8b7659" strokeWidth="3"/>)}
      <g transform={`translate(193 285) scale(${1.22-.22*p})`} opacity={p}><rect x="-172" y="-50" width="344" height="100" fill={paper} stroke={rust} strokeWidth="8"/><text y="15" textAnchor="middle" fill="#983d33" fontFamily={sans} fontWeight="bold" fontSize="43">FRACASSOU</text></g>
    </g>
  </>;
  return null;
}

function Art({type, detail}) {
  const frame=useCurrentFrame();
  const drift=Math.min(frame/36,1);
  const arrive=1-Math.pow(1-drift,3);
  return <svg width="720" height="1280" viewBox="0 0 720 1280" style={{position:'absolute'}}>
    <defs>
      <radialGradient id="desk"><stop stopColor="#655343"/><stop offset="1" stopColor="#202625"/></radialGradient>
      <radialGradient id="halo"><stop stopColor={brass} stopOpacity=".35"/><stop offset="1" stopColor={brass} stopOpacity="0"/></radialGradient>
    </defs>
    <rect width="720" height="1280" fill="url(#desk)"/>
    <g transform={`translate(${-13*drift} ${-19*drift}) scale(${1+.055*drift})`}>
      <NewScene type={type} p={arrive} frame={frame}/>
      {type==='diagram' && <>
        <g opacity=".26" stroke={brass}>
          {Array.from({length:16},(_,i)=><path key={i} d={`M45 ${288+i*38}H675 M${56+i*40} 265V890`}/>)}
        </g>
        <g transform={`translate(358 ${868-16*arrive}) scale(115 -55)`} fill="none" stroke={paper} strokeWidth=".025">
          {beams.map(([a,b],i)=><path key={i} d={`M${a[0]+a[2]*.24} ${a[1]+a[2]*.09}L${b[0]+b[2]*.24} ${b[1]+b[2]*.09}`}/>)}
        </g>
        <path d={`M72 ${790-frame*6}H648`} stroke={brass} strokeWidth="3" opacity=".55"/>
        <path d="M80 836h550M80 819v34m550-34v34" stroke={brass} strokeWidth="2"/>
        {detail && <g transform={`translate(369 560) rotate(${-15+4*arrive}) scale(${1.2-.2*arrive})`} opacity={arrive}>
          <rect x="-205" y="-47" width="410" height="94" fill="#201b19" stroke={rust} strokeWidth="6"/>
          <text y="13" textAnchor="middle" fill="#e4ab93" fontFamily={sans} fontSize="29" fontWeight="bold">{detail}</text>
        </g>}
      </>}
      {type==='identity' && <>
        <ellipse cx="354" cy="566" rx="300" ry="340" fill="url(#halo)"/>
        <Portrait x={338} y={473} scale={1.8}/>
        <Document x={550-102*arrive} y={718-64*arrive} angle={24-14*arrive} label="MINISTÉRIO" subtitle="CORRESPONDÊNCIA"/>
      </>}
      {type==='letters' && <>
        <Document x={184} y={365} angle={-11} label="CONVITE" subtitle="REUNIÃO RESERVADA"/>
        <Document x={330} y={415+32*(1-drift)} angle={11} label="CONFIDENCIAL" subtitle="PARIS • 1925"/>
        <g transform={`translate(${-35+127*arrive} ${797-73*arrive}) rotate(${-18+9*arrive})`}><rect width="448" height="207" fill="#ab906b" stroke="#544335" strokeWidth="3"/>
        <path d="M0 2L224 126 448 2M0 207l160-117m288 117L288 90" stroke="#66523d" fill="none" strokeWidth="3"/>
        <circle cx="224" cy="126" r={24*Math.min(frame/13,1)} fill={rust}/></g>
      </>}
      {type==='hotel' && <>
        <Room/>
        <Portrait x={363} y={560} scale={1.18}/>
        <path d="M0 843L154 737H566L720 843V952H0Z" fill="#513d31" stroke="#b58d64" strokeWidth="3"/>
        <path d="M305 766l126 0 37 57H269Z" fill={paper} transform={`translate(${-124*(1-arrive)} ${42*(1-arrive)})`}/>
        <Portrait x={36} y={784} scale={1.25} kind="poisson"/>
        <Portrait x={681} y={799} scale={1.23} kind="poisson"/>
      </>}
      {type==='payment' && <>
        <Portrait x={190} y={477} scale={1.44} kind="poisson"/>
        <Document x={357} y={393} angle={10} label="CONTRATO" subtitle="TORRE EIFFEL"/>
        {[0,1,2,3].map(i=><g key={i} opacity={Math.min(Math.max((frame-i*4)/7,0),1)} transform={`translate(${295+21*i-156*(1-arrive)} ${750+17*i+80*(1-arrive)}) rotate(${-12+i*5})`}>
          <rect width="252" height="91" fill="#8a9270" stroke="#3a4a40" strokeWidth="3"/>
          <rect x="8" y="8" width="236" height="75" fill="none" stroke="#50604e"/>
          <ellipse cx="126" cy="45" rx="46" ry="26" fill="none" stroke="#50604e" strokeWidth="2"/>
          <text x="126" y="52" textAnchor="middle" fontFamily={serif} fontSize="22" fill="#3a4a40">FRANCOS</text>
        </g>)}
      </>}
      {type==='escape' && <>
        <path d="M0 340H720V800H0Z" fill="#293737"/>
        <path d="M0 360H720V675H0Z" fill="#38464a"/>
        <path d="M0 698L720 707M0 742L720 773M0 787L720 840" stroke="#a3815d" strokeWidth="4"/>
        <g transform={`translate(${-65+frame*6} 0)`}>
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
        <g transform={`translate(470 765) rotate(${frame<14?Math.sin(frame*1.5)*(14-frame)*.45:0})`}>
          <path d="M-49 61Q-15 6 46 6Q91 14 104 61L113 95H-58Z" fill="#272927" stroke={ink} strokeWidth="4"/>
          <path d="M-72 6Q-16-59 85-16L109 11 87 36 51 25 47 4Q17-7-8 13L-11 35-44 48Z" fill="#323633" stroke={ink} strokeWidth="4"/>
          <ellipse cx="25" cy="61" rx="38" ry="18" fill="#56544a"/>
        </g>
      </>}
      {type==='return' && <>
        <Document x={113} y={395} angle={-13} label="TORRE EIFFEL" subtitle="PARIS • 1925"/>
        <Document x={452-122*arrive} y={510-86*arrive} angle={25-14*arrive} label="NOVA OFERTA" subtitle="CONFIDENCIAL"/>
        <Portrait x={115} y={815} scale={1.35}/>
      </>}
    </g>
  </svg>;
}

const shots = [
  [0,'tower','PARIS, 1925','A venda impossível',360,580,1],
  [2.45,'auction','PARIS, 1925','Um comprador',360,560,1.12],
  [4.05,'river','PARIS, 1925','Às margens do Sena',360,600,1.1],
  [6.25,'diagram','O MONUMENTO','Nunca esteve à venda',365,560,1.12,'FORA DE VENDA'],
  [9.02,'identity','O IMPOSTOR','Victor Lustig',335,450,1.28],
  [11.6,'worker','A OPORTUNIDADE','O custo da torre',360,610,1.13],
  [14.0,'ledger','A OPORTUNIDADE','Manutenção cara',350,560,1.1],
  [16.26,'scheme','O PLANO','Lustig vê uma brecha',350,550,1.12],
  [18.72,'credential','A FARSA','Um falso funcionário',350,560,1.12],
  [21.88,'letters','OS CONVITES','Cartas aos sucateiros',330,490,1.28],
  [25.12,'mailbox','OS CONVITES','Reunião em segredo',355,610,1.15],
  [28,'facade','PARIS','A reunião no hotel',360,580,1.1],
  [29.55,'hotel','A PROPOSTA','Lustig faz o anúncio',360,555,1.16],
  [31.25,'demolition','A PROPOSTA','A torre seria desmontada',360,600,1.1],
  [33.0,'scrap','A PROPOSTA','O ferro seria vendido',363,600,1.12],
  [35.03,'payment','O COMPRADOR','André Poisson',185,490,1.55],
  [37.42,'cash','O PAGAMENTO','Poisson paga',365,650,1.14],
  [40.88,'empty','A DESCOBERTA','Era uma fraude',358,605,1.13],
  [43.28,'escape','A FUGA','Destino: Áustria',370,580,1.14],
  [46.49,'silence','O SILÊNCIO','Poisson se cala',324,525,1.26],
  [48.62,'phone','O SILÊNCIO','Ele não liga para a polícia',350,640,1.15],
  [50.96,'desk','SEM DENÚNCIA','O golpe fica em segredo',350,630,1.12],
  [53.64,'map','DE VOLTA A PARIS','Lustig volta à cidade',350,600,1.1],
  [56.48,'return','A REINCIDÊNCIA','Uma segunda oferta',441,555,1.16],
  [58.38,'silhouette','A REINCIDÊNCIA','A mesma torre',365,565,1.1],
  [60.03,'reject','A SEGUNDA TENTATIVA','O golpe fracassou',372,638,1.16],
];

function Shot({type,kicker,title,x,y,zoom,detail,duration,reverse}) {
  const frame=useCurrentFrame();
  const t=frame/Math.max(1,duration-1);
  const settle=Math.pow(1-Math.min(frame/14,1),3);
  const direction=reverse?-1:1;
  const z=zoom+.055*t+.06*settle;
  const dx=(360-x)*.63+direction*(17-34*t+22*settle);
  const dy=(630-y)*.57+11-22*t;
  return <AbsoluteFill style={{background:night,overflow:'hidden'}}>
    <AbsoluteFill style={{transformOrigin:`${x}px ${y}px`,transform:`translate(${dx}px,${dy}px) scale(${z})`}}>
      {type==='tower'?<><Skyline/><Tower/></>:<Art type={type} detail={detail}/>}
    </AbsoluteFill>
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 51% 46%, transparent 31%, #10141788 100%), linear-gradient(0deg, #11191cee 3%, transparent 31%, transparent 77%, #12191b95 100%)'}}/>
    <div style={{position:'absolute',top:90,left:55,right:55,display:'flex',alignItems:'center',gap:16,color:brass,fontFamily:sans,fontSize:17,letterSpacing:5}}>
      {kicker}<span style={{height:1,background:brass,opacity:.58,flex:1}}/>
    </div>
    <div style={{position:'absolute',bottom:105,left:55,right:50,color:paper,transform:`translateY(${20*settle}px)`,opacity:Math.min(1,.68+frame/9)}}>
      <div style={{width:44,height:3,background:rust,marginBottom:20}}/>
      <div style={{fontFamily:serif,fontSize:58,letterSpacing:-1,lineHeight:1.03}}>{title}</div>
    </div>
  </AbsoluteFill>;
}

function Eiffel() {
  return <AbsoluteFill>{shots.map(([start,type,kicker,title,x,y,zoom,detail],i)=>{
    const from=Math.round(start*FPS);
    const end=i+1===shots.length?FRAMES:Math.round(shots[i+1][0]*FPS);
    return <Sequence key={start} from={from} durationInFrames={end-from}>
      <Shot {...{type,kicker,title,x,y,zoom,detail}} duration={end-from} reverse={i%2===1}/>
    </Sequence>;
  })}</AbsoluteFill>;
}

registerRoot(()=> <Composition id="Eiffel1925" component={Eiffel} width={720} height={1280} fps={FPS} durationInFrames={FRAMES}/>);
