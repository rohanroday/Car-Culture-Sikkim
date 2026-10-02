import { $, $$ } from '../lib/dom.js';

export function initJoinForm() {
  /* ---------- the form: writes the DM, copies it, opens Instagram ---------- */
  var form = $('#joinForm'), box = $('#formBox'), msgEl = $('#msg'), successTitle = $('#successTitle');
  var fName = $('#f-name'), fIg = $('#f-ig'), fRide = $('#f-ride'), fWhy = $('#f-why');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = fName.value.trim(), ig = fIg.value.trim().replace(/^@+/, ''), ok = true;
    var set = function(input, errId, text){ $('#' + errId).textContent = text; input.setAttribute('aria-invalid', text ? 'true' : 'false'); if (text) ok = false; };
    set(fName, 'e-name', name ? '' : 'Tell us your name.');
    set(fIg, 'e-ig', /^[A-Za-z0-9._]{1,30}$/.test(ig) ? '' : 'Add your Instagram handle so we can reply.');
    if (!ok) { (name ? fIg : fName).focus(); return; }
    var ride = fRide.value.trim();
    var msg = 'Hi CCS, I want in.\nName: ' + name + '\nInstagram: @' + ig + (ride ? '\nI drive: ' + ride : '') + '\nI want to: ' + fWhy.value;
    msgEl.textContent = msg;
    var show = function(copied){
      successTitle.textContent = copied ? 'Message copied. One tap left.' : 'Your message is ready.';
      box.classList.add('sent'); $('#success').focus({ preventScroll: true });
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(msg).then(function(){ show(true); }, function(){ show(false); });
    else show(false);
  });
  $('#again').addEventListener('click', function(){ box.classList.remove('sent'); fName.focus(); });
}
