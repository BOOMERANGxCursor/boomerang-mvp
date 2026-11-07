import { expect, it } from "vitest";
import { authorize, extractFromSources, readJson, proposeScenarios,normalizeFile } from "../src/lib/server";
import { createCapture } from "../src/lib/memory";
import { exampleDraft } from "../src/lib/demo";

it("rejects missing configuration before paid work",()=>{
 expect(()=>authorize(new Request("http://local"),{access:undefined,key:undefined})).toThrow(/configured/i);
});
it("rejects a wrong access code",()=>{
 expect(()=>authorize(new Request("http://local",{headers:{"x-demo-access":"wrong"}}),{access:"secret",key:"configured"})).toThrow(/access/i);
});
it("enforces JSON bytes before parsing",async()=>{
 await expect(readJson(new Request("http://local",{method:"POST",body:"x".repeat(66000)}))).rejects.toThrow(/large/i);
});
it("rejects duplicate and blank sources before extraction",async()=>{
 const s=createCapture("keller-elektro").sources[0];
 await expect(extractFromSources([s,s],async()=>({}))).rejects.toThrow();
 await expect(extractFromSources([{...s,text:" "}],async()=>({}))).rejects.toThrow();
});
it("assigns rule IDs itself and checks exact source quotes",async()=>{
 const c=createCapture("keller-elektro"),rule=exampleDraft(c).rules[0];
 const {id:unused,...proposal}=rule; void unused;
 const result=await extractFromSources(c.sources,async()=>({rules:[proposal],questions:[]}));
 expect(result.rules[0].id).not.toBe("R1");expect(result.rules[0].evidence[0].quote).toBe(c.sources[0].text);
 await expect(extractFromSources(c.sources,async()=>({rules:[{...proposal,evidence:[{sourceId:"S1",quote:"invented"}]}],questions:[]}))).rejects.toMatchObject({status:502,code:"INVALID_EVIDENCE"});
});
it("rejects malformed output rather than treating it as an empty success",async()=>{
 await expect(extractFromSources(createCapture("keller-elektro").sources,async()=>({approved:true}))).rejects.toThrow();
});
it("rejects a scenario linked to an invented rule",async()=>{
 const c=createCapture("keller-elektro"),rules=exampleDraft(c).rules;
 await expect(proposeScenarios({rules,sources:c.sources},async()=>({scenarios:[{title:"Test",facts:["Fact"],choices:["A","B","C"],correctIndex:0,ruleId:"invented"}]}))).rejects.toThrow(/rule/i);
});
it("classifies malformed document-reader output as a provider failure",async()=>{
 const file=new File(["%PDF-1.4\nfictional fixture"],"notes.pdf");
 await expect(normalizeFile(file,async()=>({wrong:true}))).rejects.toMatchObject({status:502,code:"INVALID_TRANSCRIPT"});
});
it("returns a client error for mismatched file signatures",async()=>{
 await expect(normalizeFile(new File(["not a PDF"],"notes.pdf"))).rejects.toMatchObject({status:400,code:"INVALID_FILE"});
});
